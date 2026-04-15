import { Star } from "lucide-react";

const SectionDivider = () => (
  <div className="flex items-center justify-center gap-3 py-8">
    <div className="h-px w-12 bg-primary/30" />
    <Star className="h-3 w-3 text-primary/50 fill-primary/50" />
    <Star className="h-4 w-4 text-primary/70 fill-primary/70" />
    <Star className="h-3 w-3 text-primary/50 fill-primary/50" />
    <div className="h-px w-12 bg-primary/30" />
  </div>
);

export default SectionDivider;
