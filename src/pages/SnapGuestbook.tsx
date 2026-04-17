import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Plus } from "lucide-react";

interface HeartItem {
  id: number;
  name: string;
  imageUrl: string;
  imgX: number; // 0-1 within heart
  imgY: number;
  imgScale: number;
}

const MAX_HEARTS = 30;
const MAX_GALLERY = 30;

const SnapGuestbook = () => {
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const [name, setName] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [heroUrl, setHeroUrl] = useState<string>("");
  const [showAdjust, setShowAdjust] = useState(false);
  // Hero adjustment transform (relative to heart center, normalized -1..1 ish; scale multiplier)
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0, scale: 1.2 });
  const navigate = useNavigate();
  const heartBodiesRef = useRef<Map<number, { body: Matter.Body; item: HeartItem }>>(new Map());
  const nextIdRef = useRef(1);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const getLayout = useCallback(() => {
    const w = Math.min(window.innerWidth, 480);
    const padding = 16;
    const triW = w - padding * 2;
    const triH = triW * 0.88;
    const topY = 24;
    const apex = { x: w / 2, y: topY };
    const bl = { x: padding, y: topY + triH };
    const br = { x: w - padding, y: topY + triH };
    return { w, triW, triH, topY, apex, bl, br, canvasH: topY + triH + 30 };
  }, []);

  // Setup Matter.js engine + walls — full triangle so hearts stay inside the wooden frame
  useEffect(() => {
    const { apex, bl, br } = getLayout();

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.9 } });
    engineRef.current = engine;

    // Inset the triangle so hearts settle inside the dark interior pocket
    const insetTop = (bl.y - apex.y) * 0.5; // start walls below the peaks zone
    const insetApex = { x: apex.x, y: apex.y + insetTop };
    const insetBL = { x: bl.x + 28, y: bl.y - 26 };
    const insetBR = { x: br.x - 28, y: br.y - 26 };

    const wallThick = 30;
    const makeWall = (p1: {x:number;y:number}, p2: {x:number;y:number}) => {
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx);
      return Matter.Bodies.rectangle(cx, cy, len + wallThick, wallThick, {
        isStatic: true, angle, friction: 0.4, render: { visible: false },
      });
    };

    const leftWall = makeWall(insetApex, insetBL);
    const rightWall = makeWall(insetApex, insetBR);
    const bottom = Matter.Bodies.rectangle(
      (insetBL.x + insetBR.x) / 2, insetBL.y + wallThick / 2,
      insetBR.x - insetBL.x + wallThick * 2, wallThick,
      { isStatic: true, friction: 0.5, render: { visible: false } }
    );
    Matter.Composite.add(engine.world, [leftWall, rightWall, bottom]);

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, [getLayout]);

  const drawHeartPath = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    const s = size;
    const topY = cy - s * 0.4;
    ctx.moveTo(cx, cy + s * 0.55);
    ctx.bezierCurveTo(cx - s * 1.05, cy - s * 0.05, cx - s * 0.55, topY - s * 0.35, cx, topY + s * 0.15);
    ctx.bezierCurveTo(cx + s * 0.55, topY - s * 0.35, cx + s * 1.05, cy - s * 0.05, cx, cy + s * 0.55);
  };

  // Outer triangle frame path (the big wooden triangle)
  const buildTrianglePath = (
    ctx: CanvasRenderingContext2D,
    apex: {x:number;y:number},
    bl: {x:number;y:number},
    br: {x:number;y:number},
    inset: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(apex.x, apex.y + inset * 1.2);
    ctx.lineTo(br.x - inset, br.y - inset);
    ctx.lineTo(bl.x + inset, bl.y - inset);
    ctx.closePath();
  };

  // Three inner mountain peaks (shaped like the reference photo)
  // Returns peak geometry for snow caps
  const getPeaks = (apex: {x:number;y:number}, bl: {x:number;y:number}, br: {x:number;y:number}) => {
    const cx = apex.x;
    const baseY = apex.y + (bl.y - apex.y) * 0.55; // peaks base around middle
    const triW = br.x - bl.x;
    const scale = triW / 360;
    return [
      { x: cx - 70 * scale, y: baseY - 95 * scale, w: 110 * scale, baseY }, // left
      { x: cx + 8 * scale,  y: baseY - 145 * scale, w: 130 * scale, baseY }, // center (tallest)
      { x: cx + 78 * scale, y: baseY - 80 * scale, w: 100 * scale, baseY }, // right
    ];
  };

  const buildPeakPath = (
    ctx: CanvasRenderingContext2D,
    p: { x: number; y: number; w: number; baseY: number },
  ) => {
    // Smooth mountain peak (rounded triangle)
    const left = p.x - p.w / 2;
    const right = p.x + p.w / 2;
    ctx.beginPath();
    ctx.moveTo(left, p.baseY);
    ctx.quadraticCurveTo(p.x - p.w * 0.18, p.y + p.w * 0.15, p.x, p.y);
    ctx.quadraticCurveTo(p.x + p.w * 0.18, p.y + p.w * 0.15, right, p.baseY);
    ctx.closePath();
  };

  // Snow cap on top of a peak
  const buildSnowCap = (
    ctx: CanvasRenderingContext2D,
    p: { x: number; y: number; w: number; baseY: number },
  ) => {
    const capH = p.w * 0.42;
    const capBottomY = p.y + capH;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    // right side following peak
    ctx.quadraticCurveTo(p.x + p.w * 0.09, p.y + capH * 0.45, p.x + p.w * 0.22, capBottomY);
    // wavy bottom edge of snow
    ctx.quadraticCurveTo(p.x + p.w * 0.14, capBottomY - 4, p.x + p.w * 0.06, capBottomY);
    ctx.quadraticCurveTo(p.x - p.w * 0.02, capBottomY + 5, p.x - p.w * 0.10, capBottomY - 1);
    ctx.quadraticCurveTo(p.x - p.w * 0.18, capBottomY - 6, p.x - p.w * 0.22, capBottomY);
    // left side back to apex
    ctx.quadraticCurveTo(p.x - p.w * 0.09, p.y + capH * 0.45, p.x, p.y);
    ctx.closePath();
  };

  const drawTree = (ctx: CanvasRenderingContext2D, x: number, baseY: number, h: number) => {
    const w = h * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, baseY - h);
    ctx.lineTo(x - w / 2, baseY);
    ctx.lineTo(x + w / 2, baseY);
    ctx.closePath();
    ctx.fill();
  };

  // Render loop
  useEffect(() => {
    let animFrame: number;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) { animFrame = requestAnimationFrame(draw); return; }
      const ctx = canvas.getContext("2d");
      if (!ctx) { animFrame = requestAnimationFrame(draw); return; }

      const dpr = window.devicePixelRatio || 2;
      const { w, canvasH, apex, bl, br } = getLayout();
      canvas.width = w * dpr;
      canvas.height = canvasH * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${canvasH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, canvasH);

      // Wood tones
      const woodOuter = "#6b4a2b";
      const woodMid = "#5a3d22";
      const woodInner = "#7a5535";
      const interior = "#3a3d2a";   // dark olive
      const interiorTop = "#454832";
      const snow = "#f4ede0";
      const snowShadow = "#d9cfbb";

      // 1) Outer wooden triangle (big frame)
      buildTrianglePath(ctx, apex, bl, br, 0);
      ctx.fillStyle = woodOuter;
      ctx.fill();

      // Wood grain shading on outer frame
      const woodGrad = ctx.createLinearGradient(0, apex.y, 0, bl.y);
      woodGrad.addColorStop(0, "#7a5535");
      woodGrad.addColorStop(0.5, "#6b4a2b");
      woodGrad.addColorStop(1, "#4e3520");
      buildTrianglePath(ctx, apex, bl, br, 0);
      ctx.fillStyle = woodGrad;
      ctx.fill();

      // 2) Inner dark olive area (the "pocket" inside the frame)
      ctx.save();
      buildTrianglePath(ctx, apex, bl, br, 18);
      ctx.clip();

      const interiorGrad = ctx.createLinearGradient(0, apex.y, 0, bl.y);
      interiorGrad.addColorStop(0, interiorTop);
      interiorGrad.addColorStop(1, interior);
      ctx.fillStyle = interiorGrad;
      ctx.fillRect(0, 0, w, canvasH);

      // 3) Three mountain peaks (wood colored) inside the frame
      const peaks = getPeaks(apex, bl, br);
      peaks.forEach((p) => {
        // Peak shadow
        buildPeakPath(ctx, p);
        const pgrad = ctx.createLinearGradient(p.x - p.w / 2, p.y, p.x + p.w / 2, p.baseY);
        pgrad.addColorStop(0, "#8a6038");
        pgrad.addColorStop(0.5, woodInner);
        pgrad.addColorStop(1, woodMid);
        ctx.fillStyle = pgrad;
        ctx.fill();

        // Subtle ridge highlight on the right side of each peak
        ctx.save();
        buildPeakPath(ctx, p);
        ctx.clip();
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.w / 2, p.baseY);
        ctx.lineTo(p.x, p.baseY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // 4) Snow caps on each peak
      peaks.forEach((p) => {
        buildSnowCap(ctx, p);
        ctx.fillStyle = snow;
        ctx.fill();
        // small shadow under snow
        ctx.save();
        buildSnowCap(ctx, p);
        ctx.clip();
        ctx.fillStyle = snowShadow;
        ctx.beginPath();
        ctx.ellipse(p.x + p.w * 0.05, p.y + p.w * 0.35, p.w * 0.18, p.w * 0.06, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5) Pine forest at the base
      const baseY = bl.y - 22;
      const triBaseW = br.x - bl.x;
      const treeCount = Math.floor(triBaseW / 16);
      ctx.fillStyle = "#2a3320";
      for (let i = 0; i < treeCount; i++) {
        const t = (i + 0.5) / treeCount;
        const x = bl.x + 24 + t * (triBaseW - 48);
        const h = 14 + ((i * 53) % 8);
        drawTree(ctx, x, baseY, h);
      }

      // 6) Hearts inside (drawn over peaks/forest, clipped to interior)
      heartBodiesRef.current.forEach(({ body, item }) => {
        const { x, y } = body.position;
        const angle = body.angle;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        const size = 18;
        if (item.imageUrl && imageCache.current.has(item.imageUrl)) {
          ctx.save();
          ctx.beginPath();
          drawHeartPath(ctx, 0, 0, size);
          ctx.closePath();
          ctx.clip();
          const img = imageCache.current.get(item.imageUrl)!;
          const baseSize = size * 2.2;
          const drawW = baseSize * item.imgScale;
          const drawH = baseSize * item.imgScale * (img.height / img.width);
          ctx.drawImage(
            img,
            -drawW / 2 + item.imgX * size,
            -drawH / 2 + item.imgY * size,
            drawW,
            drawH
          );
          ctx.restore();
          ctx.beginPath();
          drawHeartPath(ctx, 0, 0, size);
          ctx.closePath();
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = "rgba(255,255,255,0.85)";
          ctx.stroke();
        } else {
          ctx.beginPath();
          drawHeartPath(ctx, 0, 0, size);
          ctx.closePath();
          ctx.fillStyle = "#c9a878";
          ctx.fill();
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = "rgba(60,40,20,0.6)";
          ctx.stroke();
          if (item.name) {
            ctx.fillStyle = "#3a2818";
            ctx.font = "600 6px 'Noto Sans KR', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(item.name.slice(0, 4), 0, 3);
          }
        }
        ctx.restore();
      });

      ctx.restore(); // end interior clip

      // 7) Couple name + date inside the frame (top area)
      ctx.fillStyle = "#e8dcc4";
      ctx.textAlign = "center";
      ctx.font = "600 18px 'Gowun Batang', serif";
      ctx.fillText("최준호 & 이수연", apex.x, apex.y + (bl.y - apex.y) * 0.36);
      ctx.font = "500 13px 'Gowun Batang', serif";
      ctx.fillStyle = "#cfc1a4";
      ctx.fillText("2026년 6월 6일", apex.x, apex.y + (bl.y - apex.y) * 0.44);

      // 8) Outer frame outline
      buildTrianglePath(ctx, apex, bl, br, 0);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#3a2515";
      ctx.stroke();

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrame);
  }, [getLayout]);

  const dropHeart = useCallback((heartName: string, heartImage: string, offset: {x:number;y:number;scale:number}) => {
    if (!engineRef.current) return;
    if (heartBodiesRef.current.size >= MAX_HEARTS) return;

    const { w, topY } = getLayout();
    const id = nextIdRef.current++;
    const item: HeartItem = {
      id,
      name: heartName || "익명",
      imageUrl: heartImage || "",
      imgX: offset.x,
      imgY: offset.y,
      imgScale: offset.scale,
    };

    if (heartImage) {
      const img = new Image();
      img.src = heartImage;
      img.onload = () => imageCache.current.set(heartImage, img);
    }

    const radius = 16;
    // Spawn inside the triangle, just below the peak zone
    const { apex, bl } = getLayout();
    const spawnY = apex.y + (bl.y - apex.y) * 0.55;
    const x = w / 2 + (Math.random() - 0.5) * 40;
    const body = Matter.Bodies.circle(x, spawnY, radius, {
      restitution: 0.25,
      friction: 0.6,
      density: 0.003,
      render: { visible: false },
    });

    Matter.Composite.add(engineRef.current.world, body);
    heartBodiesRef.current.set(id, { body, item });
    setHearts((prev) => [...prev, item]);
  }, [getLayout]);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const room = MAX_GALLERY - galleryFiles.length;
    const accepted = files.slice(0, room);
    const newUrls = accepted.map((f) => URL.createObjectURL(f));
    setGalleryFiles((prev) => [...prev, ...accepted]);
    setGalleryUrls((prev) => [...prev, ...newUrls]);
    e.target.value = "";
  };

  const removeGalleryItem = (idx: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryUrls((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (heroUrl) URL.revokeObjectURL(heroUrl);
    const url = URL.createObjectURL(file);
    setHeroUrl(url);
    setHeroOffset({ x: 0, y: 0, scale: 1.2 });
    setShowAdjust(true);
    e.target.value = "";
  };

  const handleUpload = () => {
    if (hearts.length >= MAX_HEARTS) return;
    dropHeart(name, heroUrl, heroOffset);
    setName("");
    setHeroUrl("");
    setHeroOffset({ x: 0, y: 0, scale: 1.2 });
    setGalleryFiles([]);
    setGalleryUrls((prev) => { prev.forEach(URL.revokeObjectURL); return []; });
  };

  // Hero drag in adjust modal
  const heroDragRef = useRef<{ startX: number; startY: number; offX: number; offY: number } | null>(null);
  const onHeroPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    heroDragRef.current = { startX: e.clientX, startY: e.clientY, offX: heroOffset.x, offY: heroOffset.y };
  };
  const onHeroPointerMove = (e: React.PointerEvent) => {
    if (!heroDragRef.current) return;
    const dx = (e.clientX - heroDragRef.current.startX) / 40; // tune sensitivity
    const dy = (e.clientY - heroDragRef.current.startY) / 40;
    setHeroOffset((o) => ({ ...o, x: heroDragRef.current!.offX + dx, y: heroDragRef.current!.offY + dy }));
  };
  const onHeroPointerUp = () => { heroDragRef.current = null; };

  const { w, canvasH } = getLayout();

  return (
    <div
      className="min-h-screen flex justify-center"
      style={{
        backgroundColor: "#474A37",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
      }}
    >
      <div className="w-full max-w-[480px] min-h-screen relative pb-16">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate("/")} className="text-white/90 p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-serif text-white text-lg">스냅 방명록</h1>
          <div className="w-10" />
        </div>

        {/* Mountain canvas */}
        <div ref={containerRef} className="relative mx-auto" style={{ width: w, height: canvasH }}>
          <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: w, height: canvasH }} />
        </div>

        {/* Form */}
        <div className="px-6 pt-4 space-y-5">
          {/* Name */}
          <div className="flex items-center gap-3">
            <label className="font-serif text-white text-base shrink-0">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border-2 border-white/40 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white bg-transparent"
            />
          </div>

          {/* Photos/Videos + Hero */}
          <div className="flex items-start gap-4">
            {/* Gallery upload (max 30) */}
            <div className="flex-1">
              <p className="text-white/80 text-xs mb-1.5 ml-1">사진 / 동영상</p>
              <label className="flex items-center justify-center w-full h-14 border-2 border-white/40 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-white text-sm">+ 추가하기</span>
                <input type="file" accept="image/*,video/*" multiple onChange={handleGalleryChange} className="hidden" />
              </label>
              <p className="text-white/60 text-xs mt-1 text-center">
                {galleryFiles.length} / {MAX_GALLERY}장
              </p>
              {galleryUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {galleryUrls.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded overflow-hidden">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeGalleryItem(i)}
                        className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5"
                        aria-label="remove"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hero (single) */}
            <div className="w-24">
              <p className="text-white/80 text-xs mb-1.5 text-center">대표사진추가</p>
              <label className="relative flex items-center justify-center cursor-pointer w-24 h-24 group">
                {/* Heart shape via SVG */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                  <defs>
                    <clipPath id="heartClip">
                      <path d="M50 88 C 8 60, 12 22, 50 38 C 88 22, 92 60, 50 88 Z" />
                    </clipPath>
                  </defs>
                  {heroUrl && (
                    <image
                      href={heroUrl}
                      x={50 - 40 * heroOffset.scale + heroOffset.x * 4}
                      y={50 - 40 * heroOffset.scale + heroOffset.y * 4}
                      width={80 * heroOffset.scale}
                      height={80 * heroOffset.scale}
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#heartClip)"
                    />
                  )}
                  <path
                    d="M50 88 C 8 60, 12 22, 50 38 C 88 22, 92 60, 50 88 Z"
                    fill="none"
                    stroke="hsl(var(--olive-dark, 70 12% 25%))"
                    strokeWidth="2.5"
                    style={{ stroke: "#474A37" }}
                  />
                </svg>
                {!heroUrl && (
                  <span className="relative text-white text-xs font-medium pointer-events-none">+ 추가하기</span>
                )}
                <input type="file" accept="image/*" onChange={handleHeroChange} className="hidden" />
              </label>
              {heroUrl && (
                <button
                  onClick={() => setShowAdjust(true)}
                  className="block mx-auto mt-1 text-[10px] text-white/70 underline"
                >
                  사진 조정
                </button>
              )}
            </div>
          </div>

          {/* Upload */}
          <div className="flex justify-center pt-3">
            <button
              onClick={handleUpload}
              disabled={hearts.length >= MAX_HEARTS}
              className="px-10 py-2 border-2 border-white/60 rounded-md text-white font-serif text-base hover:bg-white/10 transition-colors disabled:opacity-40"
            >
              올리기
            </button>
          </div>

          <p className="text-center text-white/50 text-xs">
            하트 {hearts.length} / {MAX_HEARTS}
          </p>
        </div>

        {/* Hero adjust modal */}
        {showAdjust && heroUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
            <div className="w-full max-w-[360px] bg-white rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-white text-base">하트 안에 사진 맞추기</h3>
                <button onClick={() => setShowAdjust(false)} className="text-white"><X size={20} /></button>
              </div>

              {/* Drag area */}
              <div
                onPointerDown={onHeroPointerDown}
                onPointerMove={onHeroPointerMove}
                onPointerUp={onHeroPointerUp}
                onPointerCancel={onHeroPointerUp}
                className="relative mx-auto w-64 h-64 touch-none select-none cursor-grab active:cursor-grabbing"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <clipPath id="heartClipBig">
                      <path d="M50 88 C 8 60, 12 22, 50 38 C 88 22, 92 60, 50 88 Z" />
                    </clipPath>
                  </defs>
                  <image
                    href={heroUrl}
                    x={50 - 40 * heroOffset.scale + heroOffset.x * 4}
                    y={50 - 40 * heroOffset.scale + heroOffset.y * 4}
                    width={80 * heroOffset.scale}
                    height={80 * heroOffset.scale}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#heartClipBig)"
                  />
                  <path
                    d="M50 88 C 8 60, 12 22, 50 38 C 88 22, 92 60, 50 88 Z"
                    fill="none"
                    stroke="#474A37"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* Zoom slider */}
              <div className="space-y-1">
                <label className="text-xs text-white/70">확대 / 축소</label>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.05}
                  value={heroOffset.scale}
                  onChange={(e) => setHeroOffset((o) => ({ ...o, scale: parseFloat(e.target.value) }))}
                  className="w-full accent-olive-dark"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setHeroOffset({ x: 0, y: 0, scale: 1.2 })}
                  className="flex-1 py-2 border border-olive-dark/40 rounded-md text-white text-sm"
                >
                  초기화
                </button>
                <button
                  onClick={() => setShowAdjust(false)}
                  className="flex-1 py-2 bg-olive-dark text-white rounded-md text-sm"
                >
                  완료
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnapGuestbook;
