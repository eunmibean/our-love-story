import { ChevronDown } from "lucide-react";
import mainPhoto from "@/assets/main_photo.jpeg";

const HeroSection = () => {
  return (
    <section className="relative w-full">
      <div className="flex flex-col items-center">
        {/* 대문 사진 — overflow-hidden은 사진 div에만 */}
        <div className="relative w-full overflow-hidden">
          <img src={mainPhoto} alt="main" className="w-full" />
          {/* 사진 하단 그라데이션 — 흰색으로 페이드 */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-white via-white/60 to-transparent" />
          
        </div>

        {/* 텍스트 구역 */}
        <div
          className="relative w-full flex flex-col items-center text-center space-y-4 pt-10 pb-16"
          style={{ backgroundImage: "url('/gradation.png')", backgroundSize: "repeat", backgroundPosition: "auto" }}
        >
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          <p className="relative font-serif text-primary/80 text-sm tracking-[0.3em]">WEDDING INVITATION</p>
          <h1 className="relative font-serif text-4xl text-foreground tracking-wider">
            김종재 <span className="text-primary">&</span> 전민정
          </h1>
          <p className="relative text-foreground/70 text-sm">2026. 10. 10 토요일 오후 4시 50분</p>
          <p className="relative text-foreground/70 text-sm">빌라드지디 안산, 7층 그레이스켈리홀</p>
        </div>
        {/* SCROLL */}
          <div className="absolute bottom-2 inset-x-0 flex flex-col items-center gap-1 animate-bounce-down">
            <span className="text-xs text-primary/60 tracking-widest">SCROLL</span>
            <ChevronDown className="h-4 w-4 text-primary/60" />
          </div>
      </div>
    </section>
  );
};

export default HeroSection;
