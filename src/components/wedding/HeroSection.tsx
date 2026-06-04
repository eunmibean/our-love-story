import { ChevronDown } from "lucide-react";
const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-white" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-serif text-primary/80 text-sm tracking-[0.3em] drop-shadow-lg">WEDDING INVITATION</p>
          <h1 className="font-serif text-4xl text-foreground tracking-wider drop-shadow-lg">
            김종재 <span className="text-primary">&</span> 전민정
          </h1>
          <p className="text-foreground/70 text-sm drop-shadow">2026. 10. 10 토요일 오후 4시 50분</p>
          <p className="text-foreground/70 text-sm drop-shadow">빌라드지디 안산, 7층 그레이스켈리홀</p>
        </div>
      </div>
      <div className="absolute bottom-8 inset-x-0 mx-auto w-fit flex flex-col items-center gap-2 animate-bounce-down">
        <span className="text-xs text-primary/60 tracking-widest">SCROLL</span>
        <ChevronDown className="h-5 w-5 text-primary/60" />
      </div>
    </section>
  );
};

export default HeroSection;
