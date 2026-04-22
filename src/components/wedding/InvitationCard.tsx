import { Star } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const InvitationCard = () => {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} className={`px-6 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="text-center space-y-8">
        <div className="space-y-1 font-serif text-sm text-muted-foreground">
          <p>&lt;신랑아버지&gt;·&lt;신랑어머니&gt;의 장남 <span className="text-foreground font-medium">&lt;신랑이름&gt;</span></p>
          <p>&lt;신부아버지&gt;·&lt;신부어머니&gt;의 장녀 <span className="text-foreground font-medium">&lt;신부이름&gt;</span></p>
        </div>

        <div className="space-y-4 font-serif text-foreground/90 text-[15px] leading-relaxed">
          <p>
            오랜 시간 걸음 지키며<br />
            서로의 하루가 되어주었습니다.
          </p>
          <p>
            이제 부부라는 이름으로<br />
            같은 방향을 걸어가려 합니다.
          </p>
          <p>
            이 뜻깊은 시작의 자리에<br />
            소중한 분들을 정중히 초대합니다.
          </p>
        </div>

        <p className="font-serif text-primary text-sm tracking-wider">
          &lt;신랑이름&gt;·&lt;신부이름&gt; 드림
        </p>
      </div>
    </section>
  );
};

export default InvitationCard;
