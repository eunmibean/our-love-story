import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";

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
  const [showModal, setShowModal] = useState(false);
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
    // Main big triangle
    const triW = w - padding * 2;
    const triH = triW * 1.2;
    const topY = 40;
    const apex = { x: w / 2, y: topY };
    const bl = { x: padding, y: topY + triH };
    const br = { x: w - padding, y: topY + triH };
    return { w, triW, triH, topY, apex, bl, br, canvasH: topY + triH + 20 };
  }, []);

  // Setup Matter.js engine + walls
  useEffect(() => {
    const { w, canvasH, apex, bl, br } = getLayout();

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.8 } });
    engineRef.current = engine;

    // Triangle walls (static)
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

  // Custom render loop
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
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, canvasH);

      // === Draw mountain scene inside triangle (clipped) ===
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(apex.x, apex.y + 6);
      ctx.lineTo(bl.x + 4, bl.y - 4);
      ctx.lineTo(br.x - 4, br.y - 4);
      ctx.closePath();
      ctx.clip();

      // Dark background inside
      ctx.fillStyle = "#2a2d22";
      ctx.fillRect(0, 0, w, canvasH);

      // Mountain layers (back to front)
      // Far mountains - dark grey
      ctx.fillStyle = "#4a4d40";
      ctx.beginPath();
      ctx.moveTo(bl.x, bl.y - 120);
      ctx.lineTo(bl.x + 60, bl.y - 200);
      ctx.lineTo(bl.x + 100, bl.y - 170);
      ctx.lineTo(w / 2 - 40, bl.y - 250);
      ctx.lineTo(w / 2, bl.y - 220);
      ctx.lineTo(w / 2 + 50, bl.y - 260);
      ctx.lineTo(br.x - 80, bl.y - 180);
      ctx.lineTo(br.x - 30, bl.y - 210);
      ctx.lineTo(br.x, bl.y - 130);
      ctx.lineTo(br.x, bl.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.fill();

      // Mid mountains - slightly lighter
      ctx.fillStyle = "#3d4032";
      ctx.beginPath();
      ctx.moveTo(bl.x, bl.y - 80);
      ctx.lineTo(bl.x + 80, bl.y - 160);
      ctx.lineTo(bl.x + 130, bl.y - 120);
      ctx.lineTo(w / 2, bl.y - 180);
      ctx.lineTo(w / 2 + 60, bl.y - 140);
      ctx.lineTo(br.x - 50, bl.y - 170);
      ctx.lineTo(br.x, bl.y - 90);
      ctx.lineTo(br.x, bl.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.fill();

      // Snow caps
      ctx.fillStyle = "#e8e8e0";
      // Snow on far left peak
      const snowPeaks = [
        { px: bl.x + 60, py: bl.y - 200, sw: 18 },
        { px: w / 2 - 40, py: bl.y - 250, sw: 22 },
        { px: w / 2 + 50, py: bl.y - 260, sw: 20 },
        { px: br.x - 30, py: bl.y - 210, sw: 16 },
      ];
      snowPeaks.forEach(({ px, py, sw }) => {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - sw, py + sw * 0.8);
        ctx.lineTo(px + sw, py + sw * 0.8);
        ctx.closePath();
        ctx.fill();
      });

      // Forest/trees at bottom
      ctx.fillStyle = "#1e2118";
      const treeBaseY = bl.y;
      for (let tx = bl.x; tx < br.x; tx += 12) {
        const treeH = 30 + Math.random() * 25;
        ctx.beginPath();
        ctx.moveTo(tx, treeBaseY);
        ctx.lineTo(tx - 6, treeBaseY);
        ctx.lineTo(tx - 1, treeBaseY - treeH);
        ctx.lineTo(tx + 4, treeBaseY);
        ctx.closePath();
        ctx.fill();
      }

      // Draw hearts inside the triangle
      heartBodiesRef.current.forEach(({ body, item }) => {
        const { x, y } = body.position;
        const angle = body.angle;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        if (item.imageUrl && imageCache.current.has(item.imageUrl)) {
          // Heart clip with photo
          ctx.beginPath();
          drawHeartPath(ctx, 0, 0, 20);
          ctx.closePath();
          ctx.clip();
          const img = imageCache.current.get(item.imageUrl)!;
          ctx.drawImage(img, -20, -20, 40, 40);
        } else {
          // Solid lime heart
          ctx.fillStyle = "#d8e592";
          ctx.beginPath();
          drawHeartPath(ctx, 0, 0, 20);
          ctx.closePath();
          ctx.fill();
          
          // Name text
          if (item.name) {
            ctx.fillStyle = "#474a37";
            ctx.font = "bold 7px 'Noto Sans KR', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(item.name, 0, 5);
          }
        }

        ctx.restore();
      });

      ctx.restore(); // end clip

      // === Draw wooden frame border ===
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#8B6914";
      ctx.lineJoin = "miter";
      ctx.beginPath();
      ctx.moveTo(apex.x, apex.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.lineTo(br.x, br.y);
      ctx.closePath();
      ctx.stroke();

      // Outer highlight
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#A68B3C";
      ctx.beginPath();
      ctx.moveTo(apex.x, apex.y - 3);
      ctx.lineTo(bl.x - 3, bl.y + 3);
      ctx.lineTo(br.x + 3, br.y + 3);
      ctx.closePath();
      ctx.stroke();

      // Inner shadow
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#6B4F10";
      ctx.beginPath();
      ctx.moveTo(apex.x, apex.y + 6);
      ctx.lineTo(bl.x + 5, bl.y - 4);
      ctx.lineTo(br.x - 5, br.y - 4);
      ctx.closePath();
      ctx.stroke();

      // Multiple mountain peaks on top frame
      const peakData = [
        { x: apex.x - 50, h: 20 },
        { x: apex.x, h: 30 },
        { x: apex.x + 50, h: 22 },
      ];
      peakData.forEach(({ x: px, h }) => {
        // Get Y on the frame at this X
        const t = (px - apex.x) / (br.x - apex.x);
        const baseY = apex.y + Math.abs(t) * (br.y - apex.y) * 0.15;
        ctx.fillStyle = "#8B6914";
        ctx.beginPath();
        ctx.moveTo(px - 18, baseY);
        ctx.lineTo(px, baseY - h);
        ctx.lineTo(px + 18, baseY);
        ctx.closePath();
        ctx.fill();
        // Snow cap
        ctx.fillStyle = "#e8e8e0";
        ctx.beginPath();
        ctx.moveTo(px, baseY - h);
        ctx.lineTo(px - 7, baseY - h + 8);
        ctx.lineTo(px + 7, baseY - h + 8);
        ctx.closePath();
        ctx.fill();
      });

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrame);
  }, [getLayout]);

  const drawHeartPath = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    const s = size;
    const topY = cy - s * 0.4;
    ctx.moveTo(cx, cy + s * 0.5);
    ctx.bezierCurveTo(cx - s, cy - s * 0.1, cx - s * 0.6, topY - s * 0.3, cx, topY + s * 0.1);
    ctx.bezierCurveTo(cx + s * 0.6, topY - s * 0.3, cx + s, cy - s * 0.1, cx, cy + s * 0.5);
  };

  const addHeart = useCallback(() => {
    if (!engineRef.current) return;
    if (hearts.length >= MAX_HEARTS) return;

    const { w, topY } = getLayout();
    const id = nextIdRef.current++;
    const item: HeartItem = { id, name: name || "익명", imageUrl: previewUrl || "" };

    // Cache image
    if (previewUrl) {
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => imageCache.current.set(previewUrl, img);
    }

    const radius = 18;
    const x = w / 2 + (Math.random() - 0.5) * 80;
    const body = Matter.Bodies.circle(x, topY - 10, radius, {
      restitution: 0.3,
      friction: 0.5,
      density: 0.003,
      render: { visible: false },
    });

    Matter.Composite.add(engineRef.current.world, body);
    heartBodiesRef.current.set(id, { body, item });
    setHearts((prev) => [...prev, item]);
    setShowModal(false);
    setName("");
    setSelectedFile(null);
    setPreviewUrl("");
  }, [hearts.length, name, previewUrl, getLayout]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Add sample hearts
  useEffect(() => {
    if (!engineRef.current) return;
    const timeout = setTimeout(() => {
      const samples = ["김민수", "이지은", "박준형", "최수연", "정하나", "홍길동", "강다연"];
      const { w, topY } = getLayout();
      samples.forEach((sampleName, i) => {
        setTimeout(() => {
          if (!engineRef.current) return;
          const id = nextIdRef.current++;
          const item: HeartItem = { id, name: sampleName, imageUrl: "" };
          const radius = 18;
          const x = w / 2 + (Math.random() - 0.5) * 60;
          const body = Matter.Bodies.circle(x, topY - 10, radius, {
            restitution: 0.3, friction: 0.5, density: 0.003,
            render: { visible: false },
          });
          Matter.Composite.add(engineRef.current!.world, body);
          heartBodiesRef.current.set(id, { body, item });
          setHearts((prev) => [...prev, item]);
        }, i * 350);
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [getLayout]);

  const { w, canvasH } = getLayout();

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate("/")} className="text-[#d8e592] p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-serif text-[#d8e592] text-lg">스냅 방명록</h1>
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
        <div className="text-center py-4 space-y-1">
          <p className="font-serif text-[#d8e592] text-lg tracking-wider">최준호 &amp; 이수연</p>
          <p className="text-[#d8e592]/60 text-sm font-serif">2026년 6월 6일</p>
        </div>

        {/* Count + Add button */}
        <div className="text-center pb-8 space-y-4">
          <p className="text-[#d8e592]/50 text-xs">
            {hearts.length} / {MAX_HEARTS} 하트
          </p>
          <button
            onClick={() => hearts.length < MAX_HEARTS && setShowModal(true)}
            disabled={hearts.length >= MAX_HEARTS}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d8e592] text-[#474a37] rounded-full font-medium text-sm hover:bg-[#d8e592]/90 transition-colors disabled:opacity-50"
          >
            <Plus size={16} />
            사진 올리기
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
            <div className="w-full max-w-[480px] bg-[#474a37] border-t border-[#d8e592]/20 rounded-t-2xl p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-[#d8e592] text-lg">사진 올리기</h3>
                <button onClick={() => setShowModal(false)} className="text-[#d8e592]">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[#d8e592]/70 text-sm block mb-1">이름</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="w-full bg-[#3a3d2e] border border-[#d8e592]/20 rounded-lg px-4 py-3 text-[#d8e592] text-sm placeholder:text-[#d8e592]/30 focus:outline-none focus:border-[#d8e592]/50"
                  />
                </div>
                <div>
                  <label className="text-[#d8e592]/70 text-sm block mb-1">사진</label>
                  {previewUrl ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => { setSelectedFile(null); setPreviewUrl(""); }}
                        className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5"
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-[#d8e592]/20 rounded-lg cursor-pointer hover:border-[#d8e592]/40 transition-colors">
                      <span className="text-[#d8e592]/40 text-sm">사진 선택</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
                <button
                  onClick={addHeart}
                  className="w-full py-3 bg-[#d8e592] text-[#474a37] rounded-lg font-medium text-sm hover:bg-[#d8e592]/90 transition-colors"
                >
                  추가하기
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
