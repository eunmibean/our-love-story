import { useState, useEffect } from "react";
import { X, Heart, Calendar, MapPin } from "lucide-react";
import RSVPFormModal from "./RSVPFormModal";

const STORAGE_KEY = "rsvp_popup_hidden_date";

const RSVPInitialPopup = () => {
  const [show, setShow] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();
    if (hidden !== today) {
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => setShow(false);

  const hideToday = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
    close();
  };

  const openForm = () => {
    close();
    setFormOpen(true);
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
            <button
              onClick={close}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-xl text-center text-primary mb-4">참석 여부 전달</h2>
            <p className="text-sm text-center text-foreground/70 leading-relaxed mb-6">
              결혼식에 참석해주시는 모든 분들을<br />
              더욱 특별하게 모시고자 하오니,<br />
              참석 여부 전달을 부탁드립니다.
            </p>

            <div className="border-t border-dashed border-border pt-5 mb-6 space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Heart className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" />
                <span>
                  <span className="text-primary font-medium">신랑</span> 김종재,{" "}
                  <span className="text-primary font-medium">신부</span> 전민정
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                <span>2026년 10월 10일 토요일 오후 4시 50분</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>경기 안산시 단원구 광덕4로 140</span>
              </div>
            </div>

            <button
              onClick={openForm}
              className="w-full py-3.5 rounded-lg text-sm font-medium tracking-wider transition-all hover:brightness-105"
              style={{ backgroundColor: "#a3bd7a", color: "#fff" }}
            >
              참석 여부 전달
            </button>
            <button
              onClick={hideToday}
              className="w-full mt-3 text-xs text-muted-foreground flex items-center justify-center gap-1.5"
            >
              <span>✓</span> 오늘하루 보지않기
            </button>
          </div>
        </div>
      )}

      <RSVPFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
};

export default RSVPInitialPopup;
