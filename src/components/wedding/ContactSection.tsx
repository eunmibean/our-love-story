import { useState } from "react";
import { Phone, MessageSquare, X } from "lucide-react";
import { useInView } from "@/hooks/useInView";

interface ContactPerson {
  relation: string;
  name: string;
  phone: string;
}

const groomSide: ContactPerson[] = [
  { relation: "신랑", name: "신랑이름", phone: "010-0000-0000" },
  { relation: "신랑 아버지", name: "신랑아버지", phone: "010-0000-0000" },
  { relation: "신랑 어머니", name: "신랑어머니", phone: "010-0000-0000" },
];

const brideSide: ContactPerson[] = [
  { relation: "신부", name: "신부이름", phone: "010-0000-0000" },
  { relation: "신부 아버지", name: "신부아버지", phone: "010-0000-0000" },
  { relation: "신부 어머니", name: "신부어머니", phone: "010-0000-0000" },
];

const ContactCard = ({ person }: { person: ContactPerson }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-xs text-muted-foreground">{person.relation}</p>
      <p className="text-sm font-medium text-foreground">{person.name}</p>
    </div>
    <div className="flex gap-2">
      <a href={`tel:${person.phone}`} className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
        <Phone className="h-4 w-4 text-primary" />
      </a>
      <a href={`sms:${person.phone}`} className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
        <MessageSquare className="h-4 w-4 text-primary" />
      </a>
    </div>
  </div>
);

const ContactSection = () => {
  const [open, setOpen] = useState(false);
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} className={`px-6 py-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="text-center">
        <button
          onClick={() => setOpen(true)}
          className="px-8 py-3 rounded-full font-medium text-sm transition-colors"
          style={{ backgroundColor: "#a3bd7a", color: "#fff0d0" }}
        >
          연락하기
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-[480px] bg-card rounded-t-2xl p-6 animate-slide-up dot-pattern">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-primary hover:text-primary/80">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-serif text-lg text-center mb-6 text-foreground">연락처</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs text-primary font-medium mb-3 text-center tracking-wider">신랑측</h4>
                <div className="divide-y divide-border">
                  {groomSide.map((p) => <ContactCard key={p.relation} person={p} />)}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-primary font-medium mb-3 text-center tracking-wider">신부측</h4>
                <div className="divide-y divide-border">
                  {brideSide.map((p) => <ContactCard key={p.relation} person={p} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSection;
