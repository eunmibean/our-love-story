import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import RSVPFormModal from "./RSVPFormModal";

const RSVPSection = () => {
  const { ref, isVisible } = useInView();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <section
        ref={ref}
        className={`px-6 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="text-center space-y-4">
          <h2 className="font-serif text-lg text-primary">참석 여부 전달</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            결혼식에 참석해주시는 모든 분들을<br />
            더욱 특별하게 모시고자 하오니,<br />
            참석 여부 전달을 부탁드립니다.
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="px-10 py-3 rounded-lg text-sm font-medium tracking-wider transition-all hover:brightness-105"
            style={{ backgroundColor: "#a3bd7a", color: "#fff" }}
          >
            참석 여부 전달
          </button>
        </div>
      </section>

      <RSVPFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
};

export default RSVPSection;
