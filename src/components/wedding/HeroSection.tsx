import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Placeholder hero - replace with uploaded hero.jpg */}
      <div className="absolute inset-0 bg-gradient-to-b from-olive-dark/80 via-olive/60 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-serif text-primary/80 text-sm tracking-[0.3em]">WEDDING INVITATION</p>
          <h1 className="font-serif text-4xl text-foreground tracking-wider">
            신랑이름 <span className="text-primary">&</span> 신부이름
          </h1>
          <p className="text-muted-foreground text-sm">2025. 00. 00 토요일 오후 0시</p>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-down">
        <span className="text-xs text-primary/60 tracking-widest">SCROLL</span>
        <ChevronDown className="h-5 w-5 text-primary/60" />
      </div>
    </section>
  );
};

export default HeroSection;
