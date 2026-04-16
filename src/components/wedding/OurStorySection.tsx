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

const frameStyles = [
  "rounded-lg border-[3px] border-dashed",
  "rounded-sm border-[3px] border-double",
  "rounded-xl border-[3px] border-wavy",
  "rounded-md border-[3px]",
  "rounded-lg border-[3px] border-dotted",
  "rounded-sm border-[3px]",
];

const OurStorySection = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className={`px-6 py-12 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
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
          <div
            key={month.label}
            className="flex flex-col items-center"
            style={{ transform: `rotate(${month.rotation})` }}
          >
            {/* Month label - hand-drawn style */}
            <span
              className="text-xs font-bold text-primary tracking-wider mb-1"
              style={{ fontFamily: "'Gowun Batang', serif" }}
            >
              {month.label}
            </span>

            {/* Photo frame with hand-drawn border effect */}
            <div
              className={`relative w-full aspect-square bg-secondary/50 overflow-hidden ${frameStyles[i % frameStyles.length]} border-primary/40`}
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
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>

              {/* Placeholder content */}
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                <span className="text-2xl">📷</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer text */}
      <p
        className="text-center text-xs text-muted-foreground mt-8 tracking-[0.2em] uppercase"
      >
        소중한 우리의 순간들 • {new Date().getFullYear()}
      </p>
    </section>
  );
};

/** Generate unique squiggly border paths per frame */
function getSquigglyPath(seed: number): string {
  const s = seed * 7;
  // Top edge
  const top = `M 2,4 Q 15,${2 + (s % 3)} 25,4 Q 40,${6 - (s % 2)} 50,4 Q 65,${2 + (s % 4)} 75,4 Q 88,${5 - (s % 3)} 98,4`;
  // Right edge
  const right = `L 98,${15 + (s % 3)} Q ${96 + (s % 3)},30 98,45 Q ${100 - (s % 2)},60 98,75 Q ${96 + (s % 4)},88 98,96`;
  // Bottom edge
  const bottom = `L 85,${96 + (s % 2)} Q 70,${98 - (s % 3)} 50,96 Q 35,${98 - (s % 2)} 20,96 Q 10,${94 + (s % 3)} 2,96`;
  // Left edge
  const left = `L 2,${85 - (s % 2)} Q ${4 - (s % 3)},70 2,55 Q ${4 + (s % 2)},40 2,25 Q ${3 - (s % 3)},12 2,4`;

  return `${top} ${right} ${bottom} ${left} Z`;
}

export default OurStorySection;
