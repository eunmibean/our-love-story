import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";

import p001 from "@/assets/wedding_photo/001.jpeg";
import p002 from "@/assets/wedding_photo/002.jpeg";
import p003 from "@/assets/wedding_photo/003.jpeg";
import p004 from "@/assets/wedding_photo/004.jpeg";
import p005 from "@/assets/wedding_photo/005.jpeg";
import p006 from "@/assets/wedding_photo/006.jpeg";
import p007 from "@/assets/wedding_photo/007.jpeg";
import p008 from "@/assets/wedding_photo/008.jpeg";
import p009 from "@/assets/wedding_photo/009.jpeg";
import p010 from "@/assets/wedding_photo/010.jpeg";
import p011 from "@/assets/wedding_photo/011.jpeg";
import p012 from "@/assets/wedding_photo/012.jpeg";
import p013 from "@/assets/wedding_photo/013.jpeg";
import p014 from "@/assets/wedding_photo/014.jpeg";
import p015 from "@/assets/wedding_photo/015.jpeg";
import p016 from "@/assets/wedding_photo/016.jpeg";
import p017 from "@/assets/wedding_photo/017.jpeg";
import p018 from "@/assets/wedding_photo/018.jpeg";
import p019 from "@/assets/wedding_photo/019.jpeg";
import p020 from "@/assets/wedding_photo/020.jpeg";
import p021 from "@/assets/wedding_photo/021.jpeg";

const photos = [
  p001, p002, p003, p004, p005, p006, p007,
  p008, p009, p010, p011, p012, p013, p014,
  p015, p016, p017, p018, p019, p020, p021,
];

const INITIAL_COUNT = 9;

const GallerySection = () => {
  const { ref, isVisible } = useInView();
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + photos.length) % photos.length);
  }, [lightbox]);

  const next = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % photos.length);
  }, [lightbox]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next]);

  return (
    <section ref={ref} className={`py-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <h2 className="font-serif text-lg text-center mb-6 text-foreground">갤러리</h2>

      <div className="relative">
        <div className="grid grid-cols-3 gap-0.5 px-0">
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                (e.currentTarget as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
                setLightbox(i);
              }}
              className={`aspect-square overflow-hidden ${i >= INITIAL_COUNT && !expanded ? "hidden" : ""}`}
            >
              <img
                src={src}
                alt={`gallery-${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>

        {/* 접기 전 하단 페이드 */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>

      {/* 더보기 / 접기 */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>접기 <ChevronLeft className="w-4 h-4 rotate-90" /></>
          ) : (
            <>더보기 <ChevronRight className="w-4 h-4 rotate-90" /></>
          )}
        </button>
      </div>

      {/* 라이트박스 */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          {/* 이전 */}
          <button
            className="absolute left-1 text-white/70 hover:text-white z-10 p-1"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* 사진 + 닫기 버튼 */}
          <div
            className="relative"
            style={{ maxHeight: "96vh", maxWidth: "96vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-1.5 right-1.5 text-white/90 hover:text-white z-10 bg-black/30 rounded-full p-0.5"
              onClick={() => setLightbox(null)}
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={photos[lightbox]}
              alt={`photo-${lightbox + 1}`}
              className="block object-contain select-none"
              style={{ maxHeight: "96vh", maxWidth: "96vw" }}
            />
            {/* 카운터 */}
            <p className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-white/60 text-xs bg-black/30 px-2 py-0.5 rounded-full">
              {lightbox + 1} / {photos.length}
            </p>
          </div>

          {/* 다음 */}
          <button
            className="absolute right-1 text-white/70 hover:text-white z-10 p-1"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
