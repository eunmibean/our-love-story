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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const navigate = useNavigate();
  const heartBodiesRef = useRef<Map<number, { body: Matter.Body; item: HeartItem }>>(new Map());
  const nextIdRef = useRef(1);

  // Get dimensions based on container
  const getTriangleDimensions = useCallback(() => {
    const w = Math.min(window.innerWidth, 480);
    const padding = 30;
    const triW = w - padding * 2;
    const triH = triW * 1.1;
    const topY = 60;
    const apex = { x: w / 2, y: topY };
    const bottomLeft = { x: padding, y: topY + triH };
    const bottomRight = { x: w - padding, y: topY + triH };
    return { w, triW, triH, topY, apex, bottomLeft, bottomRight, canvasH: topY + triH + 80 };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const { w, canvasH, apex, bottomLeft, bottomRight } = getTriangleDimensions();
    const wallThickness = 20;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.8 } });
    engineRef.current = engine;

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine,
      options: {
        width: w,
        height: canvasH,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio || 2,
      },
    });
    renderRef.current = render;

    // Create triangle walls
    const leftWall = createWall(apex, bottomLeft, wallThickness);
    const rightWall = createWall(apex, bottomRight, wallThickness);
    const bottomWall = Matter.Bodies.rectangle(
      (bottomLeft.x + bottomRight.x) / 2,
      bottomLeft.y,
      bottomRight.x - bottomLeft.x + wallThickness,
      wallThickness,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );

    Matter.Composite.add(engine.world, [leftWall, rightWall, bottomWall]);

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [getTriangleDimensions]);

  const createWall = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    thickness: number
  ) => {
    const cx = (p1.x + p2.x) / 2;
    const cy = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    return Matter.Bodies.rectangle(cx, cy, length + thickness, thickness, {
      isStatic: true,
      angle,
      render: { fillStyle: "transparent" },
    });
  };

  const addHeart = useCallback(() => {
    if (!engineRef.current) return;
    if (hearts.length >= MAX_HEARTS) return;

    const { w, topY } = getTriangleDimensions();
    const id = nextIdRef.current++;
    const item: HeartItem = {
      id,
      name: name || "익명",
      imageUrl: previewUrl || "",
    };

    // Create circular body for heart
    const radius = 22;
    const x = w / 2 + (Math.random() - 0.5) * 100;
    const body = Matter.Bodies.circle(x, topY - 20, radius, {
      restitution: 0.4,
      friction: 0.3,
      density: 0.002,
      render: { fillStyle: "#d8e592" },
    });

    Matter.Composite.add(engineRef.current.world, body);
    heartBodiesRef.current.set(id, { body, item });
    setHearts((prev) => [...prev, item]);
    setShowModal(false);
    setName("");
    setSelectedFile(null);
    setPreviewUrl("");
  }, [hearts.length, name, previewUrl, getTriangleDimensions]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Custom rendering for hearts overlay
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animFrame: number;

    const drawOverlay = () => {
      const canvas = overlayCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w, canvasH } = getTriangleDimensions();
      canvas.width = w * (window.devicePixelRatio || 2);
      canvas.height = canvasH * (window.devicePixelRatio || 2);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${canvasH}px`;
      ctx.scale(window.devicePixelRatio || 2, window.devicePixelRatio || 2);
      ctx.clearRect(0, 0, w, canvasH);

      // Draw triangle frame
      const { apex, bottomLeft, bottomRight } = getTriangleDimensions();
      ctx.strokeStyle = "#8B6914";
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(apex.x, apex.y);
      ctx.lineTo(bottomLeft.x, bottomLeft.y);
      ctx.lineTo(bottomRight.x, bottomRight.y);
      ctx.closePath();
      ctx.stroke();

      // Draw wood texture border
      ctx.strokeStyle = "#A0722A";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(apex.x, apex.y - 4);
      ctx.lineTo(bottomLeft.x - 3, bottomLeft.y + 3);
      ctx.lineTo(bottomRight.x + 3, bottomRight.y + 3);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw heart shapes at body positions
      heartBodiesRef.current.forEach(({ body }) => {
        const { x, y } = body.position;
        const angle = body.angle;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        drawHeart(ctx, 0, 0, 18, "#d8e592");
        ctx.restore();
      });

      animFrame = requestAnimationFrame(drawOverlay);
    };

    animFrame = requestAnimationFrame(drawOverlay);
    return () => cancelAnimationFrame(animFrame);
  }, [getTriangleDimensions]);

  const drawHeart = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    const topY = cy - size * 0.4;
    ctx.moveTo(cx, cy + size * 0.5);
    ctx.bezierCurveTo(cx - size, cy - size * 0.1, cx - size * 0.6, topY - size * 0.3, cx, topY + size * 0.1);
    ctx.bezierCurveTo(cx + size * 0.6, topY - size * 0.3, cx + size, cy - size * 0.1, cx, cy + size * 0.5);
    ctx.fill();
  };

  const { w, canvasH } = getTriangleDimensions();

  // Add sample hearts on mount
  useEffect(() => {
    if (!engineRef.current) return;
    const timeout = setTimeout(() => {
      const sampleNames = ["김민수", "이지은", "박준형", "최수연", "정하나"];
      const { w: cw, topY } = getTriangleDimensions();

      sampleNames.forEach((sampleName, i) => {
        setTimeout(() => {
          if (!engineRef.current) return;
          const id = nextIdRef.current++;
          const item: HeartItem = { id, name: sampleName, imageUrl: "" };
          const radius = 22;
          const x = cw / 2 + (Math.random() - 0.5) * 80;
          const body = Matter.Bodies.circle(x, topY - 20, radius, {
            restitution: 0.4,
            friction: 0.3,
            density: 0.002,
            render: { fillStyle: "#d8e592" },
          });
          Matter.Composite.add(engineRef.current!.world, body);
          heartBodiesRef.current.set(id, { body, item });
          setHearts((prev) => [...prev, item]);
        }, i * 400);
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [getTriangleDimensions]);

  return (
    <div className="min-h-screen bg-[#474a37] flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate("/")} className="text-[#d8e592] p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-serif text-[#d8e592] text-lg">스냅 방명록</h1>
          <div className="w-10" />
        </div>

        {/* Mountain canvas area */}
        <div ref={containerRef} className="relative" style={{ width: w, height: canvasH }}>
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, width: w, height: canvasH }}
          />
          <canvas
            ref={overlayCanvasRef}
            style={{ position: "absolute", top: 0, left: 0, width: w, height: canvasH, pointerEvents: "none" }}
          />
        </div>

        {/* Names and date */}
        <div className="text-center py-6 space-y-2">
          <p className="font-serif text-[#d8e592] text-lg">최준호 &amp; 이수연</p>
          <p className="text-[#d8e592]/60 text-sm">2026년 6월 6일</p>
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
            <div
              className="w-full max-w-[480px] bg-[#474a37] border-t border-[#d8e592]/20 rounded-t-2xl p-6 animate-slide-up"
            >
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
