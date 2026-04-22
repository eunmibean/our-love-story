import { useInView } from "@/hooks/useInView";
import venueImg1 from "@/assets/venue-info-1.png";
import venueImg2 from "@/assets/venue-info-2.png";
import venueImg3 from "@/assets/venue-info-3.png";
import venueImg4 from "@/assets/venue-info-4.png";

const infoCards = [
  { image: venueImg1, text: "신부 대기실이 없어요.\n신부는 문앞에서 만나요." },
  { image: venueImg2, text: "화환은 필요없어요." },
  { image: venueImg3, text: "식사는 3층이에요." },
  { image: venueImg4, text: "사진 찍고 아래 버튼 눌러\n업로드해 주세요." },
];

const VenueInfo = () => {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} className={`px-6 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <h2 className="font-serif text-lg text-center mb-6 text-foreground">예식장 안내</h2>
      <div className="space-y-4">
        {infoCards.map((card, i) => (
          <div key={i} className="bg-foreground/5 backdrop-blur rounded-xl overflow-hidden flex items-center gap-4 p-4">
            <img src={card.image} alt="" className="w-28 h-20 object-contain flex-shrink-0 rounded-lg" />
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VenueInfo;
