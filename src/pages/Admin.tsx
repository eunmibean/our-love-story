import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut, RefreshCw } from "lucide-react";

interface RsvpRow {
  id: string;
  side: string;
  attendance: string;
  meal: string;
  guests: number;
  name: string;
  created_at: string;
}

const SESSION_KEY = "admin_auth";

// ── 로그인 폼 ──────────────────────────────────────────────
const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      id === import.meta.env.VITE_ADMIN_ID &&
      pw === import.meta.env.VITE_ADMIN_PASSWORD
    ) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onLogin();
    } else {
      setError("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-5"
      >
        <h1 className="text-xl font-bold text-center text-gray-800">관리자 로그인</h1>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

// ── 통계 카드 ──────────────────────────────────────────────
const StatCard = ({ label, value, sub }: { label: string; value: number; sub?: string }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value}<span className="text-sm font-normal text-gray-500 ml-1">명</span></p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

// ── 대시보드 ───────────────────────────────────────────────
const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [rows, setRows] = useState<RsvpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSide, setFilterSide] = useState("전체");
  const [filterAttend, setFilterAttend] = useState("전체");
  const [filterMeal, setFilterMeal] = useState("전체");

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("rsvp")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as RsvpRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const attending = rows.filter((r) => r.attendance === "참석");
  const groomAttend = attending.filter((r) => r.side === "신랑");
  const brideAttend = attending.filter((r) => r.side === "신부");
  const totalGuests = attending.reduce((s, r) => s + (r.guests || 0), 0);
  const mealCount = attending.filter((r) => r.meal === "예").reduce((s, r) => s + (r.guests || 0), 0);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filterSide !== "전체" && r.side !== filterSide) return false;
      if (filterAttend !== "전체" && r.attendance !== filterAttend) return false;
      if (filterMeal === "예" && r.meal !== "예") return false;
      if (filterMeal === "아니오" && !["아니오", "미정", "해당없음"].includes(r.meal)) return false;
      if (search.trim() && !r.name.includes(search.trim())) return false;
      return true;
    });
  }, [rows, filterSide, filterAttend, filterMeal, search]);

  const FilterBtn = ({
    label, active, onClick,
  }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        active
          ? "bg-green-500 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">RSVP 대시보드</h1>
          <div className="flex gap-2">
            <button onClick={fetchData} className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-500 text-xs hover:bg-gray-50">
              <LogOut className="w-3.5 h-3.5" />
              로그아웃
            </button>
          </div>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="전체 참석 인원" value={totalGuests} sub={`${attending.length}팀`} />
          <StatCard label="신랑 측" value={groomAttend.reduce((s,r)=>s+(r.guests||0),0)} sub={`${groomAttend.length}팀`} />
          <StatCard label="신부 측" value={brideAttend.reduce((s,r)=>s+(r.guests||0),0)} sub={`${brideAttend.length}팀`} />
          <StatCard label="식사 예정" value={mealCount} />
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400 w-8">측</span>
            {["전체", "신랑", "신부"].map((v) => (
              <FilterBtn key={v} label={v} active={filterSide === v} onClick={() => setFilterSide(v)} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400 w-8">참석</span>
            {["전체", "참석", "불참석"].map((v) => (
              <FilterBtn key={v} label={v} active={filterAttend === v} onClick={() => setFilterAttend(v)} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400 w-8">식사</span>
            {["전체", "예", "아니오"].map((v) => (
              <FilterBtn key={v} label={v} active={filterMeal === v} onClick={() => setFilterMeal(v)} />
            ))}
          </div>
        </div>

        {/* 검색 */}
        <input
          type="text"
          placeholder="이름으로 검색 (빈칸이면 전체)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* 테이블 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <p className="text-center py-12 text-sm text-gray-400">불러오는 중...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-sm text-gray-400">결과 없음</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">이름</th>
                    <th className="text-center px-3 py-3 text-xs text-gray-500 font-medium">측</th>
                    <th className="text-center px-3 py-3 text-xs text-gray-500 font-medium">참석</th>
                    <th className="text-center px-3 py-3 text-xs text-gray-500 font-medium">인원</th>
                    <th className="text-center px-3 py-3 text-xs text-gray-500 font-medium">식사</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">등록일시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{r.name}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${r.side === "신랑" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>
                          {r.side}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${r.attendance === "참석" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {r.attendance}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-gray-700">{r.guests}</td>
                      <td className="px-3 py-3 text-center text-gray-600 text-xs">{r.meal}</td>
                      <td className="px-4 py-3 text-right text-xs text-gray-400">
                        {new Date(r.created_at).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
            총 {filtered.length}건
          </div>
        </div>
      </div>
    </div>
  );
};

// ── 메인 ───────────────────────────────────────────────────
const Admin = () => {
  const [authed, setAuthed] = useState(sessionStorage.getItem(SESSION_KEY) === "true");

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={handleLogout} />;
};

export default Admin;
