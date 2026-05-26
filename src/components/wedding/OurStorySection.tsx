import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import img11 from "@/assets/stories_month/11.jpg";
import img12 from "@/assets/stories_month/12.jpg";

const months = [
  { label: "JAN", rotation: "-2deg",  image: img1 },
  { label: "FEB", rotation: "1deg",   image: img2 },
  { label: "MAR", rotation: "-1deg",  image: img3 },
  { label: "APR", rotation: "2deg",   image: img4 },
  { label: "MAY", rotation: "-1.5deg",image: img5 },
  { label: "JUN", rotation: "1.5deg", image: img6 },
  { label: "JUL", rotation: "-2deg",  image: img7 },
  { label: "AUG", rotation: "0.5deg", image: img8 },
  { label: "SEP", rotation: "-1deg",  image: img9 },
  { label: "OCT", rotation: "1.5deg", image: img10 },
  { label: "NOV", rotation: "-0.5deg",image: img11 },
  { label: "DEC", rotation: "2deg",   image: img12 },
];

const frameStyles = [
  "rounded-lg border-[3px] border-dashed",
  "rounded-sm border-[3px] border-double",
  "rounded-xl border-[3px] border-wavy",
  "rounded-md border-[3px]",
  "rounded-lg border-[3px] border-dotted",
  "rounded-sm border-[3px]",
];

const OurStorySection = () => {
  const { ref, isVisible: isInView } = useInView();
  const [selected, setSelected] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);

  const close = () => {
    setSelected(null);
    setFlipped(false);
  };

  return (
    <section
      ref={ref}
      className={`px-6 py-12 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* Title */}
      <h2
        className="text-center font-heading text-3xl font-bold text-foreground mb-2"
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        우리의 이야기
      </h2>
      <p className="text-center text-muted-foreground text-sm mb-8">WHAT A YEAR!</p>

      {/* 12-month grid */}
      <div className="grid grid-cols-3 gap-3">
        {months.map((month, i) => (
          <button
            key={month.label}
            type="button"
            onClick={() => {
              setSelected(i);
              setFlipped(false);
            }}
            className="flex flex-col items-center cursor-pointer"
            style={{ transform: `rotate(${month.rotation})` }}
          >
            {/* Month label - hand-drawn style */}
            <span
              className="text-xs font-bold tracking-wider mb-1"
              style={{ fontFamily: "'Gowun Batang', serif", color: "#333333" }}
            >
              {month.label}
            </span>

            {/* Photo frame with hand-drawn border effect */}
            <div
              className={`relative w-full aspect-square bg-secondary/50 overflow-hidden ${frameStyles[i % frameStyles.length]}`}
              style={{ borderColor: "#A4BE7B" }}
            >
              {/* Squiggly SVG frame overlay */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d={getSquigglyPath(i)}
                  fill="none"
                  stroke="#A4BE7B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>

              <img
                src={month.image}
                alt={month.label}
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Footer text */}
      <p
        className="text-center text-xs text-muted-foreground mt-8 tracking-[0.2em] uppercase"
      >
        소중한 우리의 순간들 • {new Date().getFullYear()}
      </p>

      {/* Modal */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-6 right-6 text-white/90 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setFlipped((f) => !f);
              }}
              className="relative w-full max-w-xs cursor-pointer"
              style={{ perspective: 1200 }}
            >
              <motion.div
                className="relative w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Front - polaroid frame */}
                <div
                  className="bg-card p-3 pb-12 shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: "2px",
                  }}
                >
                  <div
                    className="relative w-full aspect-square bg-secondary/40 overflow-hidden"
                    style={{ borderRadius: "1px" }}
                  >
                    <img
                      src={months[selected].image}
                      alt={months[selected].label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="block text-center text-base font-bold text-foreground/80 tracking-wider mt-4"
                    style={{ fontFamily: "'Gowun Batang', serif" }}
                  >
                    {months[selected].label}
                  </span>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 bg-white p-3 pb-12 shadow-2xl flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: "2px",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(0,0,0,0.015) 0 2px, transparent 2px 4px)",
                  }}
                >
                  <span
                    className="text-6xl text-black"
                    style={{ fontFamily: "'NanumGyuri', 'Gowun Batang', serif" }}
                  >
                    사랑해
                  </span>
                </div>
              </motion.div>

              <p className="text-center text-xs text-white/70 mt-4 tracking-wider">
                탭하여 뒤집기
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/** Generate unique squiggly border paths per frame */
function getSquigglyPath(seed: number): string {
  const s = seed * 7;
  const top = `M 2,4 Q 15,${2 + (s % 3)} 25,4 Q 40,${6 - (s % 2)} 50,4 Q 65,${2 + (s % 4)} 75,4 Q 88,${5 - (s % 3)} 98,4`;
  const right = `L 98,${15 + (s % 3)} Q ${96 + (s % 3)},30 98,45 Q ${100 - (s % 2)},60 98,75 Q ${96 + (s % 4)},88 98,96`;
  const bottom = `L 85,${96 + (s % 2)} Q 70,${98 - (s % 3)} 50,96 Q 35,${98 - (s % 2)} 20,96 Q 10,${94 + (s % 3)} 2,96`;
  const left = `L 2,${85 - (s % 2)} Q ${4 - (s % 3)},70 2,55 Q ${4 + (s % 2)},40 2,25 Q ${3 - (s % 3)},12 2,4`;

  return `${top} ${right} ${bottom} ${left} Z`;
}

export default OurStorySection;
