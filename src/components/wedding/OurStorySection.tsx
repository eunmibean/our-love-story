import { useState } from "react";
import { X } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import img1 from "@/assets/stories_month/1.jpeg";
import img2 from "@/assets/stories_month/2.jpeg";
import img3 from "@/assets/stories_month/3.jpeg";
import img4 from "@/assets/stories_month/4.jpeg";
import img5 from "@/assets/stories_month/5.jpeg";
import img6 from "@/assets/stories_month/6.jpeg";
import img7 from "@/assets/stories_month/7.jpeg";
import img8 from "@/assets/stories_month/8.jpeg";
import img9 from "@/assets/stories_month/9.jpeg";
import img10 from "@/assets/stories_month/10.jpeg";
import img11 from "@/assets/stories_month/11.jpeg";
import img12 from "@/assets/stories_month/12.jpeg";

const groups = [
  {
    images: [img1, img2, img3],
    caption: "함께여서 더 많이 웃을 수 있었습니다.",
  },
  {
    images: [img4, img5, img6],
    caption: "새로운 풍경 속에서 서로를 더 알아갔습니다.",
  },
  {
    images: [img7, img8, img9],
    caption: "계절마다 소중한 추억이 하나씩 늘어났습니다.",
  },
  {
    images: [img10, img11, img12],
    caption: "그리고 이제, 평생을 함께하기로 약속했습니다.",
  },
];

const allImages = groups.flatMap((g) => g.images);

const OurStorySection = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useInView();
  const [selected, setSelected] = useState<number | null>(null);

  const close = () => setSelected(null);

  return (
    <section
      ref={sectionRef}
      className={`px-6 py-12 transition-all duration-700 ${sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* <h2
        className="text-center font-heading text-3xl font-bold text-foreground mb-2"
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        우리의 이야기
      </h2> */}
      

      <div className="space-y-8">
        {groups.map((group, gi) => (
          <div key={gi} className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              {group.images.map((src, ii) => {
                const flatIndex = gi * 3 + ii;
                return (
                  <button
                    key={ii}
                    type="button"
                    onClick={() => setSelected(flatIndex)}
                    className="aspect-square overflow-hidden rounded-lg"
                  >
                    <img
                      src={src}
                      alt={`story-${flatIndex + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                );
              })}
            </div>
            <p
              className="text-center text-sm text-foreground/70 leading-relaxed"
              style={{ fontFamily: "'Gowun Batang', serif" }}
            >
              {group.caption}
            </p>
          </div>
        ))}
      </div>

      {/* <p className="text-center text-xs text-muted-foreground mt-8 tracking-[0.2em] uppercase">
        소중한 우리의 순간들 • {new Date().getFullYear()}
      </p> */}

      {/* 모달 */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={close}
        >
          <div
            className="relative"
            style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-1.5 right-1.5 text-white/90 hover:text-white z-10 bg-black/30 rounded-full p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={allImages[selected]}
              alt={`story-${selected + 1}`}
              className="block object-contain rounded-lg"
              style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default OurStorySection;
