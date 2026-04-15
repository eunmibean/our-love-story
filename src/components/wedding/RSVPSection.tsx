import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { toast } from "sonner";

const RSVPSection = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    side: "" as "" | "groom" | "bride",
    name: "",
    attendance: "" as "" | "attend" | "absent",
    guestCount: "",
    companion: "",
    meal: "" as "" | "yes" | "no" | "undecided",
  });
  const { ref, isVisible } = useInView();

  // Auto popup after 2s, once per day
  useEffect(() => {
    const lastShown = localStorage.getItem("rsvp_popup_date");
    const today = new Date().toDateString();
    if (lastShown === today) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismissToday = () => {
    localStorage.setItem("rsvp_popup_date", new Date().toDateString());
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!form.name || !form.attendance || !form.side) {
      toast.error("필수 항목을 입력해주세요");
      return;
    }
    // Save to localStorage (replace with Supabase later)
    const submissions = JSON.parse(localStorage.getItem("rsvp_submissions") || "[]");
    submissions.push({ ...form, timestamp: Date.now() });
    localStorage.setItem("rsvp_submissions", JSON.stringify(submissions));
    toast.success("참석 의사가 전달되었습니다");
    setOpen(false);
  };

  const ToggleBtn = ({ value, label, selected }: { value: string; label: string; selected: boolean }) => (
    <button
      type="button"
      onClick={() => setForm({ ...form, side: value as "groom" | "bride" })}
      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        selected ? "bg-primary text-primary-foreground" : "bg-card/50 text-muted-foreground hover:bg-card"
      }`}
    >
      {label}
    </button>
  );

  const RadioBtn = ({ name, value, label, checked, onChange }: any) => (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
        checked ? "bg-primary text-primary-foreground" : "bg-card/50 text-muted-foreground hover:bg-card"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section ref={ref} className={`px-6 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="text-center">
        <button
          onClick={() => setOpen(true)}
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          참석 의사 전달하기
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-[480px] bg-card rounded-t-2xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-primary">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-serif text-lg text-center mb-6 text-foreground">참석 의사 전달하기</h3>

            <div className="space-y-5">
              {/* Side toggle */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">구분</label>
                <div className="flex gap-2">
                  <ToggleBtn value="groom" label="신랑측" selected={form.side === "groom"} />
                  <ToggleBtn value="bride" label="신부측" selected={form.side === "bride"} />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">성함</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-card/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="성함을 입력해주세요"
                />
              </div>

              {/* Attendance */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">참석여부</label>
                <div className="flex gap-2">
                  <RadioBtn name="attendance" value="attend" label="참석" checked={form.attendance === "attend"} onChange={(v: string) => setForm({ ...form, attendance: v as any })} />
                  <RadioBtn name="attendance" value="absent" label="불참" checked={form.attendance === "absent"} onChange={(v: string) => setForm({ ...form, attendance: v as any })} />
                </div>
              </div>

              {/* Guest count */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">참석인원</label>
                <input
                  value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                  className="w-full bg-card/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="본인 포함 총 참석인원"
                  type="number"
                />
              </div>

              {/* Companion */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">동행인</label>
                <input
                  value={form.companion}
                  onChange={(e) => setForm({ ...form, companion: e.target.value })}
                  className="w-full bg-card/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="함께 오시는 분 성함"
                />
              </div>

              {/* Meal */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">식사여부</label>
                <div className="flex gap-2">
                  <RadioBtn name="meal" value="yes" label="예정" checked={form.meal === "yes"} onChange={(v: string) => setForm({ ...form, meal: v as any })} />
                  <RadioBtn name="meal" value="no" label="안함" checked={form.meal === "no"} onChange={(v: string) => setForm({ ...form, meal: v as any })} />
                  <RadioBtn name="meal" value="undecided" label="미정" checked={form.meal === "undecided"} onChange={(v: string) => setForm({ ...form, meal: v as any })} />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                참석 의사 전달하기
              </button>

              <button
                onClick={handleDismissToday}
                className="w-full text-xs text-muted-foreground/60 hover:text-muted-foreground py-2"
              >
                오늘 하루 보지 않기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RSVPSection;
