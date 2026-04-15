import { useInView } from "@/hooks/useInView";

const infoCards = [
  { title: "안내 1", content: "<안내1 내용>", placeholder: "안내1" },
  { title: "안내 2", content: "<안내2 내용>", placeholder: "안내2" },
  { title: "안내 3", content: "<안내3 내용>", placeholder: "안내3" },
];

const VenueInfo = () => {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} className={`px-6 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <h2 className="font-serif text-lg text-center mb-6 text-foreground">예식장 안내</h2>
      <div className="space-y-4">
        {infoCards.map((card) => (
          <div key={card.title} className="bg-foreground/5 backdrop-blur rounded-xl overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">{card.placeholder} 이미지</p>
            </div>
            <div className="p-4">
              <h3 className="font-serif text-sm font-medium text-foreground mb-1">{card.title}</h3>
              <p className="text-xs text-muted-foreground">{card.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VenueInfo;
