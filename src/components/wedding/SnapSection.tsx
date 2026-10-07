import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import photoAlbum from "@/assets/photo_album.jpg";

const samplePhotos = [
  { id: 1, rotate: "-rotate-6" },
  { id: 2, rotate: "rotate-2" },
  { id: 3, rotate: "rotate-6" },
];

const SnapSection = () => {
  const { ref, isVisible } = useInView();
  const uploadOpeningTime = new Date("2026-10-10T10:10:00+09:00");
  const [isUploadEnabled, setIsUploadEnabled] = useState(() => new Date() >= uploadOpeningTime);

  useEffect(() => {
    const updateState = () => {
      setIsUploadEnabled(new Date() >= uploadOpeningTime);
    };

    updateState();
    const timer = window.setInterval(updateState, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleUploadClick = () => {
    if (!isUploadEnabled) return;
    window.location.href = "https://wedding-photos.minjeong-jongjae.workers.dev/";
  };

  return (
    <section
      ref={ref}
      className={`py-12 px-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
    >
      {/* Stacked photo cards */}
      <div className="relative flex justify-center items-center h-64 mb-8">
        {samplePhotos.map((photo, i) => (
          <div
            key={photo.id}
            className={`absolute w-44 h-56 bg-card rounded-xl shadow-lg border border-border ${photo.rotate} transition-transform`}
            style={{ zIndex: i }}
          >
            <img
              src={photoAlbum}
              alt="snap"
              className="w-full h-full rounded-xl object-cover m-1.5"
              style={{ width: "calc(100% - 12px)", height: "calc(100% - 12px)" }}
            />
          </div>
        ))}
      </div>

      {/* Text content */}
      <p className="text-center text-xs tracking-[0.3em] text-muted-foreground mb-3 uppercase">
        Capture Our Moments
      </p>
      <h2 className="font-serif text-xl text-center text-foreground mb-6">스냅</h2>
      <div className="text-center text-sm text-muted-foreground leading-relaxed mb-8 space-y-1">
        <p>신랑신부의 행복한 순간을 담아주세요.</p>
        <p>예식 당일, 아래 버튼을 통해 사진을 올려주세요.</p>
        <p>많은 참여 부탁드려요!</p>
      </div>

      {/* Upload button */}
      <div className="flex justify-center mb-4">
        <button
          disabled={!isUploadEnabled}
          onClick={handleUploadClick}
          className="w-full max-w-xs py-4 border border-border rounded-lg text-foreground font-medium text-sm transition-all disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundColor: isUploadEnabled ? "#a3bd7a" : "#d9d9d9",
            color: isUploadEnabled ? "#fff0d0" : "#7a7a7a",
          }}
        >
          {isUploadEnabled ? "사진 업로드" : "10월 10일 10:10부터 가능"}
        </button>
      </div>

      {/* Date notice */}
      <div className="text-center text-xs text-muted-foreground space-y-0.5">
        <p>한국시간 기준</p>
        <p>2026-10-10 10:10부터 업로드 가능합니다.</p>
      </div>
    </section>
  );
};

export default SnapSection;
