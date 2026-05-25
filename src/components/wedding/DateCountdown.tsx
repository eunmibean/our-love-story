import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

// TODO: 실제 결혼 날짜로 변경하세요
const WEDDING_DATE = new Date("2026-10-10T13:00:00");
const WEDDING_YEAR = WEDDING_DATE.getFullYear();
const WEDDING_MONTH = WEDDING_DATE.getMonth(); // 0-indexed
const WEDDING_DAY = WEDDING_DATE.getDate();

function getDaysLeft() {
  const now = new Date();
  const diff = WEDDING_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const DateCountdown = () => {
  const [daysLeft, setDaysLeft] = useState(getDaysLeft());
  const { ref, isVisible } = useInView();
  const calendarDays = getCalendarDays(WEDDING_YEAR, WEDDING_MONTH);

  useEffect(() => {
    const timer = setInterval(() => setDaysLeft(getDaysLeft()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className={`px-6 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="text-center space-y-6">
        <p className="font-serif text-foreground">
          김종재 <span className="text-primary">❤️</span> 전민정의 결혼식이{" "}
          <span className="text-primary font-bold">{daysLeft}</span>일 남았습니다
        </p>

        {/* Calendar */}
        <div className="bg-card/50 rounded-xl p-5 inline-block">
          <p className="font-serif text-sm text-muted-foreground mb-4">
            {WEDDING_YEAR}년 {WEDDING_MONTH + 1}월
          </p>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {WEEKDAYS.map((d) => (
              <div key={d} className={`w-8 h-8 flex items-center justify-center font-medium ${d === "일" ? "text-red-400" : d === "토" ? "text-blue-400" : "text-muted-foreground"}`}>
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs transition-colors
                  ${day === WEDDING_DAY ? "bg-primary text-primary-foreground font-bold" : day ? "text-foreground/70" : ""}`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {WEDDING_YEAR}년 {WEDDING_MONTH + 1}월 {WEDDING_DAY}일 토요일 오후 4시 50분
        </p>
      </div>
    </section>
  );
};

export default DateCountdown;
