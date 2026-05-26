import { useState } from "react";
import { X, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

const RSVPFormModal = ({ open, onClose }: Props) => {
  const { toast } = useToast();
  const [side, setSide] = useState<"신랑" | "신부" | "">("");
  const [attendance, setAttendance] = useState<"참석" | "불참석" | "">("");
  const [meal, setMeal] = useState<"예" | "아니오" | "미정" | "">("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setSide("");
    setAttendance("");
    setMeal("");
    setGuests(1);
    setName("");
    setAgreed(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!side) { alert("어느 측 하객이신지 선택해주세요"); return; }
    if (!attendance) { alert("참석 여부를 선택해주세요"); return; }
    if (attendance === "참석" && !meal) { alert("식사 여부를 선택해주세요"); return; }
    if (!name.trim()) { alert("성함을 입력해주세요"); return; }
    if (!agreed) { alert("개인정보 수집 및 활용에 동의해주세요"); return; }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("rsvp").insert({
        side,
        attendance,
        meal: attendance === "불참석" ? "해당없음" : meal,
        guests: attendance === "불참석" ? 0 : guests,
        name: name.trim(),
      });
      if (error) throw error;
      toast({ title: "전달되었습니다", description: "참석 여부가 성공적으로 전달되었습니다." });
      handleClose();
    } catch {
      toast({ variant: "destructive", title: "전달 실패", description: "다시 시도해주세요." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative w-full max-w-[480px] bg-card rounded-t-2xl animate-slide-up dot-pattern max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm pt-6 px-6 pb-4 border-b border-border/30">
          <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
          <h3 className="font-serif text-lg text-center text-foreground">참석 여부 전달</h3>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* 어느 측 */}
          <div>
            <p className="text-sm text-foreground mb-2">
              어느 측 하객이신가요? <span className="text-red-400">*</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["신랑", "신부"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setSide(v)}
                  className={`py-3 rounded-lg text-sm border transition-colors ${
                    side === v
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* 참석 여부 */}
          <div>
            <p className="text-sm text-foreground mb-2">
              참석여부 <span className="text-red-400">*</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["참석", "불참석"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setAttendance(v)}
                  className={`py-3 rounded-lg text-sm border transition-colors ${
                    attendance === v
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* 식사여부 + 동반자 수 — 참석일 때만 표시 */}
          {attendance === "참석" && (
            <>
              <div>
                <p className="text-sm text-foreground mb-2">
                  식사여부 <span className="text-red-400">*</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(["예", "아니오", "미정"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setMeal(v)}
                      className={`py-3 rounded-lg text-sm border transition-colors ${
                        meal === v
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-foreground mb-2">
                  동반자 수 <span className="text-red-400">*</span>
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors text-xl leading-none"
                  >
                    −
                  </button>
                  <span className="text-lg font-medium text-foreground w-8 text-center">{guests}</span>
                  <button
                    onClick={() => setGuests(guests + 1)}
                    className="w-10 h-10 rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors text-xl leading-none"
                  >
                    +
                  </button>
                  <span className="text-xs text-muted-foreground">명 (본인 포함)</span>
                </div>
              </div>
            </>
          )}

          {/* 성함 */}
          <div>
            <p className="text-sm text-foreground mb-2">
              성함 <span className="text-red-400">*</span>
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              maxLength={20}
              className="w-full bg-transparent border-0 border-b border-border focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/50 py-2 transition-colors"
            />
          </div>

          {/* 개인정보 동의 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAgreed(!agreed)}
              className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                agreed ? "bg-primary border-primary" : "border-border"
              }`}
            >
              {agreed && <Check className="w-3 h-3 text-white" />}
            </button>
            <span className="text-xs text-muted-foreground">개인정보 수집 및 활용 동의</span>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-xs text-primary underline underline-offset-2"
            >
              [자세히보기]
            </button>
          </div>

          {/* 전달 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-lg text-sm font-medium tracking-wider transition-all disabled:opacity-60"
            style={{ backgroundColor: "#a3bd7a", color: "#fff" }}
          >
            {submitting ? "전달 중..." : "전달"}
          </button>
        </div>

        {/* 개인정보 인라인 모달 */}
        {privacyOpen && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-black/40 rounded-t-2xl">
            <div className="bg-white rounded-2xl p-6 w-full relative">
              <button
                onClick={() => setPrivacyOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <h4 className="font-medium text-base text-center mb-5">
                (필수) 개인정보 수집 및 활용 동의
              </h4>
              <div className="text-sm text-foreground/70 space-y-3 leading-relaxed">
                <p>
                  <strong className="text-foreground">[수집 항목]</strong><br />
                  이름, 전화번호등 RSVP에 입력 된 항목
                </p>
                <p>
                  <strong className="text-foreground">[이용 목적]</strong><br />
                  결혼식 참석 여부 확인 및 관련 서비스 제공
                </p>
                <p>
                  <strong className="text-foreground">[보유 및 이용 기간]</strong><br />
                  동의일로부터 청첩장 유효기간 동안
                </p>
                <p>
                  <strong className="text-foreground">[동의 거부권 및 불이익 사항]</strong><br />
                  동의 거부 시 서비스 이용 불가
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RSVPFormModal;
