import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Heart } from "lucide-react";

interface HeartItem {
  id: number;
  name: string;
  imageUrl: string;
}

const MAX_HEARTS = 30;

const SnapGuestbook = () => {
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const navigate = useNavigate();
  const heartBodiesRef = useRef<Map<number, { body: Matter.Body; item: HeartItem }>>(new Map());
  const nextIdRef = useRef(1);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const getLayout = useCallback(() => {
    const w = Math.min(window.innerWidth, 480);
    const padding = 20;
    const triW = w - padding * 2;
    const triH = triW * 1.05;
    const topY = 50;
    const apex = { x: w / 2, y: topY };
    const bl = { x: padding, y: topY + triH };
    const br = { x: w - padding, y: topY + triH };
    return { w, triW, triH, topY, apex, bl, br, canvasH: topY + triH + 30 };
  }, []);

  // Setup Matter.js engine + walls
  useEffect(() => {
    const { apex, bl, br } = getLayout();

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.8 } });
    engineRef.current = engine;

    const wallThick = 18;
    const makeWall = (p1: {x:number;y:number}, p2: {x:number;y:number}) => {
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx);
      return Matter.Bodies.rectangle(cx, cy, len + wallThick, wallThick, {
        isStatic: true, angle, render: { visible: false },
      });
    };

    const leftWall = makeWall(apex, bl);
    const rightWall = makeWall(apex, br);
    const bottom = Matter.Bodies.rectangle(
      (bl.x + br.x) / 2, bl.y, br.x - bl.x + wallThick, wallThick,
      { isStatic: true, render: { visible: false } }
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
    ctx.moveTo(cx, cy + s * 0.5);
    ctx.bezierCurveTo(cx - s, cy - s * 0.1, cx - s * 0.6, topY - s * 0.3, cx, topY + s * 0.1);
    ctx.bezierCurveTo(cx + s * 0.6, topY - s * 0.3, cx + s, cy - s * 0.1, cx, cy + s * 0.5);
  };

  const drawTreePath = (ctx: CanvasRenderingContext2D, x: number, baseY: number, h: number) => {
    // Pine tree silhouette (triangular layers)
    const w = h * 0.55;
    ctx.beginPath();
    ctx.moveTo(x, baseY - h);
    ctx.lineTo(x - w / 2, baseY - h * 0.55);
    ctx.lineTo(x - w / 4, baseY - h * 0.55);
    ctx.lineTo(x - w / 1.6, baseY - h * 0.15);
    ctx.lineTo(x - w / 3.5, baseY - h * 0.15);
    ctx.lineTo(x - w / 2.2, baseY);
    ctx.lineTo(x + w / 2.2, baseY);
    ctx.lineTo(x + w / 3.5, baseY - h * 0.15);
    ctx.lineTo(x + w / 1.6, baseY - h * 0.15);
    ctx.lineTo(x + w / 4, baseY - h * 0.55);
    ctx.lineTo(x + w / 2, baseY - h * 0.55);
    ctx.closePath();
    ctx.fill();
  };

  // Custom render loop
  useEffect(() => {
    let animFrame: number;
    // Pre-compute fixed tree positions so they don't jitter
    const { w: lw, bl: lbl, br: lbr } = getLayout();
    const trees: { x: number; h: number }[] = [];
    const triBaseW = lbr.x - lbl.x;
    const treeCount = Math.floor(triBaseW / 18);
    for (let i = 0; i < treeCount; i++) {
      const t = (i + 0.5) / treeCount;
      const x = lbl.x + t * triBaseW;
      const h = 26 + ((i * 37) % 18);
      trees.push({ x, h });
    }

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

      // Frame wood color
      const woodColor = "#8B6F4E";
      const woodDark = "#6B4F2E";
      const interior = "#3a322b";

      // === Build top mountain peak path (3 small peaks) ===
      // Peaks above the apex line of the triangle
      const peakOffsets = [
        { x: apex.x - 55, h: 38 },
        { x: apex.x, h: 55 },
        { x: apex.x + 55, h: 42 },
      ];

      // Helper to build outer silhouette (peaks + triangle sides)
      const buildOuterPath = (inset: number) => {
        ctx.beginPath();
        // Start bottom-left
        ctx.moveTo(bl.x - inset, bl.y + inset);
        // Up the left side to apex area
        ctx.lineTo(apex.x - 75, apex.y + 10);
        // Up to first peak base (left)
        ctx.lineTo(peakOffsets[0].x - 22, apex.y + 5);
        ctx.lineTo(peakOffsets[0].x, apex.y - peakOffsets[0].h - inset);
        // Down to valley
        ctx.lineTo(peakOffsets[0].x + 18, apex.y - 5);
        // Up to middle peak
        ctx.lineTo(peakOffsets[1].x, apex.y - peakOffsets[1].h - inset);
        // Down to next valley
        ctx.lineTo(peakOffsets[1].x + 22, apex.y - 5);
        // Up to right peak
        ctx.lineTo(peakOffsets[2].x, apex.y - peakOffsets[2].h - inset);
        // Down to right side
        ctx.lineTo(peakOffsets[2].x + 22, apex.y + 5);
        ctx.lineTo(apex.x + 75, apex.y + 10);
        ctx.lineTo(br.x + inset, br.y + inset);
        ctx.closePath();
      };

      // Outer wood frame (filled brown)
      ctx.fillStyle = woodColor;
      buildOuterPath(8);
      ctx.fill();

      // Inner triangle area (dark interior)
      ctx.save();
      ctx.fillStyle = interior;
      buildOuterPath(-2);
      ctx.fill();

      // Clip interior for hearts + trees
      ctx.beginPath();
      buildOuterPath(-2);
      ctx.clip();

      // Draw pine trees at the bottom
      ctx.fillStyle = "#3d4a32";
      trees.forEach(({ x, h }) => {
        drawTreePath(ctx, x, bl.y - 2, h);
      });
      // Second darker layer in front
      ctx.fillStyle = "#2a3422";
      trees.forEach(({ x, h }, i) => {
        if (i % 2 === 0) drawTreePath(ctx, x + 6, bl.y - 2, h * 0.85);
      });

      // Draw hearts inside
      heartBodiesRef.current.forEach(({ body, item }) => {
        const { x, y } = body.position;
        const angle = body.angle;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Heart outline (white) like sketch
        if (item.imageUrl && imageCache.current.has(item.imageUrl)) {
          ctx.save();
          ctx.beginPath();
          drawHeartPath(ctx, 0, 0, 22);
          ctx.closePath();
          ctx.clip();
          const img = imageCache.current.get(item.imageUrl)!;
          ctx.drawImage(img, -22, -22, 44, 44);
          ctx.restore();
          // outline
          ctx.beginPath();
          drawHeartPath(ctx, 0, 0, 22);
          ctx.closePath();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
        } else {
          ctx.beginPath();
          drawHeartPath(ctx, 0, 0, 22);
          ctx.closePath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
          if (item.name) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "600 7px 'Noto Sans KR', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(item.name, 0, 4);
          }
        }
        ctx.restore();
      });

      ctx.restore(); // end clip

      // Wood frame outline (brown stroke on top of everything for clean edge)
      ctx.lineWidth = 3;
      ctx.strokeStyle = woodDark;
      buildOuterPath(8);
      ctx.stroke();

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrame);
  }, [getLayout]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const dropHeart = useCallback((heartName: string, heartImage: string) => {
    if (!engineRef.current) return;
    if (heartBodiesRef.current.size >= MAX_HEARTS) return;

    const { w, topY } = getLayout();
    const id = nextIdRef.current++;
    const item: HeartItem = { id, name: heartName || "익명", imageUrl: heartImage || "" };

    if (heartImage) {
      const img = new Image();
      img.src = heartImage;
      img.onload = () => imageCache.current.set(heartImage, img);
    }

    const radius = 20;
    const x = w / 2 + (Math.random() - 0.5) * 60;
    const body = Matter.Bodies.circle(x, topY + 30, radius, {
      restitution: 0.3,
      friction: 0.5,
      density: 0.003,
      render: { visible: false },
    });

    Matter.Composite.add(engineRef.current.world, body);
    heartBodiesRef.current.set(id, { body, item });
    setHearts((prev) => [...prev, item]);
  }, [getLayout]);

  const handleUpload = () => {
    if (hearts.length >= MAX_HEARTS) return;
    dropHeart(name, previewUrl);
    setName("");
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const { w, canvasH } = getLayout();

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen relative pb-12">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate("/")} className="text-olive-dark p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-serif text-olive-dark text-lg">스냅 방명록</h1>
          <div className="w-10" />
        </div>

        {/* Mountain canvas */}
        <div ref={containerRef} className="relative mx-auto" style={{ width: w, height: canvasH }}>
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, width: w, height: canvasH }}
          />
        </div>

        {/* Names and date */}
        <div className="text-center py-3 space-y-1">
          <p className="font-serif text-olive-dark text-base tracking-wider">최준호 &amp; 이수연</p>
          <p className="text-olive-dark/60 text-sm font-serif">2026년 6월 6일</p>
        </div>

        {/* Form */}
        <div className="px-6 pt-4 space-y-5">
          {/* Name input */}
          <div className="flex items-center gap-3">
            <label className="font-serif text-olive-dark text-base shrink-0">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border-2 border-olive-dark/70 rounded-md px-3 py-2 text-olive-dark text-sm focus:outline-none focus:border-olive-dark bg-transparent"
            />
          </div>

          {/* Photo + Heart row */}
          <div className="flex items-start gap-4">
            {/* Photo upload */}
            <div className="flex-1">
              <p className="text-olive-dark/80 text-xs mb-1.5 ml-1">사진 / 동영상</p>
              <label className="flex items-center justify-center w-full h-14 border-2 border-olive-dark/70 rounded-md cursor-pointer hover:bg-olive-light/10 transition-colors">
                {previewUrl ? (
                  <img src={previewUrl} alt="" className="h-12 w-12 object-cover rounded" />
                ) : (
                  <span className="text-olive-dark text-sm">+ 추가하기</span>
                )}
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
              </label>
              <p className="text-olive-dark/60 text-xs mt-1 text-center">최대 30장</p>
            </div>

            {/* Heart representative */}
            <div className="w-24">
              <p className="text-olive-dark/80 text-xs mb-1.5 text-center">대표사진추가</p>
              <label className="relative flex items-center justify-center cursor-pointer w-24 h-24">
                <Heart
                  size={92}
                  strokeWidth={2}
                  className="absolute inset-0 m-auto text-olive-dark"
                  fill={previewUrl ? "transparent" : "transparent"}
                />
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt=""
                    className="absolute w-14 h-14 object-cover"
                    style={{
                      clipPath: "path('M28 50 C 5 30, 12 8, 28 18 C 44 8, 51 30, 28 50 Z')",
                    }}
                  />
                ) : (
                  <span className="relative text-olive-dark text-xs font-medium">+ 추가하기</span>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Upload button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleUpload}
              disabled={hearts.length >= MAX_HEARTS}
              className="px-8 py-2 border-2 border-olive-dark rounded-md text-olive-dark font-serif text-base hover:bg-olive-dark hover:text-white transition-colors disabled:opacity-40"
            >
              올리기
            </button>
          </div>

          <p className="text-center text-olive-dark/50 text-xs">
            {hearts.length} / {MAX_HEARTS}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SnapGuestbook;
