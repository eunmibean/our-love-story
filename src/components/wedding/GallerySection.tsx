import { useInView } from "@/hooks/useInView";

const placeholderImages = [
  { id: 1, bg: "from-primary/20 to-primary/5" },
  { id: 2, bg: "from-primary/10 to-primary/20" },
  { id: 3, bg: "from-primary/5 to-primary/15" },
];

const GallerySection = () => {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} className={`py-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <h2 className="font-serif text-lg text-center mb-6 text-foreground">갤러리</h2>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-6 snap-x snap-mandatory">
        {placeholderImages.map((img) => (
          <div
            key={img.id}
            className={`flex-shrink-0 w-72 h-96 rounded-xl bg-gradient-to-br ${img.bg} snap-center flex items-center justify-center`}
          >
            <p className="text-muted-foreground text-sm">갤러리 {img.id}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
