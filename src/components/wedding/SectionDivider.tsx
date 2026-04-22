import { Star } from "lucide-react";

const SectionDivider = () => (
  <div className="flex items-center justify-center gap-3 py-8">
    <div className="h-px w-12" style={{ backgroundColor: "rgba(95,141,86,0.3)" }} />
    <Star className="h-3 w-3" style={{ color: "rgba(95,141,86,0.5)", fill: "rgba(95,141,86,0.5)" }} />
    <Star className="h-4 w-4" style={{ color: "rgba(95,141,86,0.7)", fill: "rgba(95,141,86,0.7)" }} />
    <Star className="h-3 w-3" style={{ color: "rgba(95,141,86,0.5)", fill: "rgba(95,141,86,0.5)" }} />
    <div className="h-px w-12" style={{ backgroundColor: "rgba(95,141,86,0.3)" }} />
  </div>
);

export default SectionDivider;
