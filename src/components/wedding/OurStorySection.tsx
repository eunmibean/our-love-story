import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const months = [
  { label: "JAN", rotation: "-2deg" },
  { label: "FEB", rotation: "1deg" },
  { label: "MAR", rotation: "-1deg" },
  { label: "APR", rotation: "2deg" },
  { label: "MAY", rotation: "-1.5deg" },
  { label: "JUN", rotation: "1.5deg" },
  { label: "JUL", rotation: "-2deg" },
  { label: "AUG", rotation: "0.5deg" },
  { label: "SEP", rotation: "-1deg" },
  { label: "OCT", rotation: "1.5deg" },
  { label: "NOV", rotation: "-0.5deg" },
  { label: "DEC", rotation: "2deg" },
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
      <h2
        className="text-center text-3xl font-bold text-foreground mb-2"
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        우리의 이야기
      </h2>
      <p className="text-center text-muted-foreground text-sm mb-8">WHAT A YEAR!</p>

      {/* 12-month polaroid grid */}
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, i) => (
          <motion.button
            key={month.label}
            type="button"
            layoutId={`polaroid-${i}`}
            onClick={() => {
              setSelected(i);
              setFlipped(false);
            }}
            className="flex flex-col items-center bg-card p-2 pb-5 shadow-md hover:shadow-lg transition-shadow"
            style={{
              transform: `rotate(${month.rotation})`,
              borderRadius: "2px",
            }}
            whileHover={{ scale: 1.05, rotate: 0 }}
          >
            <div className="relative w-full aspect-square bg-secondary/60 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                <span className="text-2xl">📷</span>
              </div>
            </div>
            <span
              className="text-xs font-bold text-foreground/80 tracking-wider mt-2"
              style={{ fontFamily: "'Gowun Batang', serif" }}
            >
              {month.label}
            </span>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 tracking-[0.2em] uppercase">
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

            <motion.div
              layoutId={`polaroid-${selected}`}
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
                {/* Front */}
                <div
                  className="bg-card p-3 pb-12 shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: "2px",
                  }}
                >
                  <div className="relative w-full aspect-square bg-secondary/60 overflow-hidden flex items-center justify-center text-muted-foreground/60">
                    <span className="text-5xl">📷</span>
                  </div>
                  <span
                    className="block text-center text-sm font-bold text-foreground/80 tracking-wider mt-3"
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
                    className="text-5xl text-black"
                    style={{ fontFamily: "'Gowun Batang', serif" }}
                  >
                    사랑해
                  </span>
                </div>
              </motion.div>

              <p className="text-center text-xs text-white/70 mt-4 tracking-wider">
                탭하여 뒤집기
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurStorySection;
