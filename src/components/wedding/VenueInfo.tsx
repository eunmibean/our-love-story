import { useInView } from "@/hooks/useInView";
import venueImg1 from "@/assets/venue-info-1.png";
import venueImg2 from "@/assets/venue-info-2.png";
import venueImg3 from "@/assets/venue-info-3.png";
import venueImg4 from "@/assets/venue-info-4.png";

const infoCards = [
  {
    image: venueImg1,
    title: "신부 대기실 없는 열린 공간",
    text: "정형화된 신부 대기실 대신, 식장 문 앞에서 찾아주신 모든 분들께 한 분 한 분 직접 감사 인사를 건네고자 합니다.",
  },
  {
    image: venueImg2,
    title: "축하 화환 사양",
    text: "축하의 마음이 담긴 화환은 정중히 사양하고자 합니다. 보내주시는 따뜻한 격려의 말씀으로도 충분히 감사하겠습니다.",
  },
  {
    image: venueImg3,
    title: "피로연장 안내",
    text: "연회장 위치는 식장 내에서 따로 상세히 안내해 드릴 예정이오니, 편안하고 즐거운 식사 시간이 되시길 바랍니다.",
  },
  {
    image: venueImg4,
    title: "오늘의 소중한 순간을 공유",
    text: "예쁜 사진을 찍으셨다면 아래 버튼을 통해 공유해 주세요. 소중한 추억으로 깊이 간직하겠습니다.",
  },
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
            <div>
              <p className="font-serif text-sm font-bold text-foreground leading-snug mb-1">{card.title}</p>
              <p className="text-xs text-foreground leading-relaxed">{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VenueInfo;
