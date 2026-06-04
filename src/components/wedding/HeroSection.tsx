import { ChevronDown } from "lucide-react";
import mainPhoto from "@/assets/main_photo.jpeg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 사진 전체화면 */}
      <img
        src={mainPhoto}
        alt="main"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 하단 그라데이션 오버레이 */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      {/* 텍스트 — 사진 하단 오버레이 */}
      <div className="absolute inset-x-0 bottom-16 text-center space-y-2 px-6">
        <p className="font-serif text-white/70 text-xs tracking-[0.35em]">WEDDING INVITATION</p>
        <h1 className="font-serif text-3xl text-white tracking-wider drop-shadow-lg">
          김종재 <span className="text-primary text-white">&</span> 전민정
        </h1>
        <p className="text-white/70 text-xs tracking-wider">2026. 10. 10 토요일 오후 4시 50분</p>
        <p className="text-white/70 text-xs tracking-wider">빌라드지디 안산, 7층 그레이스켈리홀</p>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-4 inset-x-0 mx-auto w-fit flex flex-col items-center gap-1 animate-bounce-down">
        <span className="text-xs text-white/50 tracking-widest">SCROLL</span>
        <ChevronDown className="h-4 w-4 text-white/50" />
      </div>
    </section>
  );
};

export default HeroSection;
