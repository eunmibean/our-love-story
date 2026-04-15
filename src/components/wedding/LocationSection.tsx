import { MapPin, Navigation, Car, Train } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const LocationSection = () => {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} className={`px-6 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <h2 className="font-serif text-lg text-center mb-6 text-foreground">오시는 길</h2>
      
      <div className="space-y-4">
        {/* Map placeholder - replace with Kakao Map embed */}
        <div className="w-full h-48 rounded-xl bg-card/50 flex items-center justify-center border border-border">
          <div className="text-center text-muted-foreground text-sm">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-primary/50" />
            <p>카카오맵 임베드 영역</p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-foreground">&lt;식장 주소&gt;</p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Navigation className="h-4 w-4" />
            길찾기
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-card/30 rounded-lg p-4 space-y-2">
            <Car className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">주차 안내</p>
            <p className="text-xs text-foreground/80">건물 내 주차장 이용 가능<br />(2시간 무료)</p>
          </div>
          <div className="bg-card/30 rounded-lg p-4 space-y-2">
            <Train className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">대중교통</p>
            <p className="text-xs text-foreground/80">지하철 O호선 OO역<br />O번 출구 도보 5분</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
