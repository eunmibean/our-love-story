interface Props {
  visible: boolean;
}

const LoadingScreen = ({ visible }: Props) => (
  <div
    className={`fixed inset-0 z-[60] flex flex-col items-center justify-center transition-opacity duration-700 ${
      visible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
    style={{
      backgroundImage: "url('/bg_img_white.jpg')",
      backgroundRepeat: "repeat",
      backgroundSize: "auto",
      backgroundColor: "#fff",
    }}
  >
    <p
      className="text-xs tracking-[0.4em] text-primary/60 uppercase mb-6"
      style={{ fontFamily: "'Gowun Batang', serif" }}
    >
      WEDDING INVITATION
    </p>
    <h1
      className="text-3xl text-foreground tracking-wider mb-2"
      style={{ fontFamily: "'Gowun Batang', serif" }}
    >
      김종재 <span className="text-primary">&</span> 전민정
    </h1>
    <p className="text-sm text-foreground/50 tracking-widest mb-12">
      2026 . 10 . 10
    </p>

    {/* 점 세 개 로딩 */}
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </div>
  </div>
);

export default LoadingScreen;
