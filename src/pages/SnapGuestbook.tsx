import { useRef, useState, useCallback, forwardRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, ImagePlus, Heart } from "lucide-react";
import HTMLFlipBook from "react-pageflip";

interface GuestEntry {
  id: number;
  name: string;
  imageUrl: string;
}

const MAX_MEDIA = 50;
const COUPLE = "최준호 & 이수연";
const WEDDING_DATE = "2026년 6월 6일";

// ---- Page wrapper (must be a forwardRef component for react-pageflip) ----
const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = "" }, ref) => (
    <div
      ref={ref}
      className={`relative bg-[#f5efe1] overflow-hidden ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.6), transparent 40%), radial-gradient(circle at 80% 90%, rgba(0,0,0,0.05), transparent 50%)",
      }}
    >
      {/* paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(120,90,60,0.08) 0 1px, transparent 1px 4px)",
        }}
      />
      {/* page-turn shadow gutter */}
      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
      <div className="relative h-full w-full">{children}</div>
    </div>
  ),
);
Page.displayName = "Page";

// ---- Cover (heart-framed hero photo) ----
const Cover = forwardRef<HTMLDivElement, { heroUrl: string }>(({ heroUrl }, ref) => (
  <div
    ref={ref}
    className="relative overflow-hidden"
    style={{
      background: "linear-gradient(160deg, #6b6f4f 0%, #474a37 60%, #2f3225 100%)",
    }}
  >
    {/* subtle dot pattern */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage:
          "radial-gradient(circle, #d8e592 1px, transparent 1.5px)",
        backgroundSize: "16px 16px",
      }}
    />
    {/* gold border */}
    <div className="absolute inset-3 border border-[#d8e592]/40 rounded-sm pointer-events-none" />

    <div className="relative h-full w-full flex flex-col items-center justify-center px-6 py-10">
      <p className="text-[10px] tracking-[0.4em] text-[#d8e592]/80 uppercase mb-4">
        Our Memories
      </p>

      {/* Heart frame */}
      <div className="relative w-[200px] h-[180px] mb-6">
        <svg viewBox="0 0 200 180" className="absolute inset-0 w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
          <defs>
            <clipPath id="coverHeartClip">
              <path d="M100 165 C 30 115, 10 70, 35 40 C 55 18, 85 22, 100 50 C 115 22, 145 18, 165 40 C 190 70, 170 115, 100 165 Z" />
            </clipPath>
          </defs>
          {heroUrl ? (
            <image
              href={heroUrl}
              x="0"
              y="0"
              width="200"
              height="180"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#coverHeartClip)"
            />
          ) : (
            <path
              d="M100 165 C 30 115, 10 70, 35 40 C 55 18, 85 22, 100 50 C 115 22, 145 18, 165 40 C 190 70, 170 115, 100 165 Z"
              fill="#d8e592"
              opacity="0.25"
            />
          )}
          <path
            d="M100 165 C 30 115, 10 70, 35 40 C 55 18, 85 22, 100 50 C 115 22, 145 18, 165 40 C 190 70, 170 115, 100 165 Z"
            fill="none"
            stroke="#f0e6cf"
            strokeWidth="2.5"
          />
        </svg>
        {!heroUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-10 h-10 text-[#d8e592]/70" />
          </div>
        )}
      </div>

      <h1 className="font-serif text-[#f0e6cf] text-2xl tracking-wider mb-2 text-center">
        {COUPLE}
      </h1>
      <p className="font-serif text-[#d8e592] text-base tracking-[0.25em]">
        우리들의 기록
      </p>
      <p className="mt-6 text-[11px] tracking-[0.3em] text-[#f0e6cf]/60">
        {WEDDING_DATE}
      </p>
    </div>
  </div>
));
Cover.displayName = "Cover";

// ---- Empty page placeholder ----
const EmptyPage = forwardRef<HTMLDivElement>((_, ref) => (
  <Page ref={ref}>
    <div className="h-full w-full flex flex-col items-center justify-center text-center px-6">
      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#a8946b] flex items-center justify-center mb-4">
        <Heart className="w-8 h-8 text-[#a8946b]" />
      </div>
      <p className="font-serif text-[#5a4a30] text-base mb-2">
        아직 기록이 없어요
      </p>
      <p className="text-xs text-[#8a7a5a] leading-relaxed">
        하단에서 첫 번째 기록을<br />
        남겨주세요
      </p>
    </div>
  </Page>
));
EmptyPage.displayName = "EmptyPage";

// ---- Guest page ----
const GuestPage = forwardRef<HTMLDivElement, { entry: GuestEntry; index: number }>(
  ({ entry, index }, ref) => (
    <Page ref={ref}>
      <div className="h-full w-full flex flex-col p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] tracking-[0.3em] text-[#8a7a5a] uppercase">
            Page {index + 1}
          </span>
          <Heart className="w-3.5 h-3.5 text-[#b8c870]" fill="#d8e592" />
        </div>
        <div className="flex-1 rounded-sm overflow-hidden border border-[#d4c4a0] shadow-inner bg-[#ebe2cc]">
          {entry.imageUrl ? (
            <img
              src={entry.imageUrl}
              alt={entry.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImagePlus className="w-10 h-10 text-[#a8946b]" />
            </div>
          )}
        </div>
        <div className="mt-3 text-center">
          <p className="font-serif text-[#3d3520] text-sm">
            from. <span className="font-medium">{entry.name}</span>
          </p>
        </div>
      </div>
    </Page>
  ),
);
GuestPage.displayName = "GuestPage";

const SnapGuestbook = () => {
  const navigate = useNavigate();
  const bookRef = useRef<any>(null);

  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [name, setName] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  
  const nextIdRef = useRef(1);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      mediaUrls.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const room = MAX_MEDIA - mediaFiles.length;
    const accepted = files.slice(0, room);
    const newUrls = accepted.map((f) => URL.createObjectURL(f));
    setMediaFiles((prev) => [...prev, ...accepted]);
    setMediaUrls((prev) => [...prev, ...newUrls]);
    e.target.value = "";
  };

  const removeMedia = (idx: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
    setMediaUrls((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // Cover photo is automatically derived from the first guest entry's first uploaded media.
  const heroUrl = entries[0]?.imageUrl ?? "";

  const handleSubmit = useCallback(() => {
    if (!name.trim()) {
      alert("이름을 입력해주세요");
      return;
    }
    if (mediaUrls.length === 0) {
      alert("사진/동영상을 한 장 이상 추가해주세요");
      return;
    }
    const entry: GuestEntry = {
      id: nextIdRef.current++,
      name: name.trim(),
      imageUrl: mediaUrls[0], // first media becomes the page
    };
    setEntries((prev) => [...prev, entry]);
    // reset form (keep media url referenced by entry — don't revoke)
    setName("");
    setMediaFiles([]);
    setMediaUrls([]);
    // flip to last page
    setTimeout(() => {
      try {
        bookRef.current?.pageFlip()?.flip(entries.length + 1);
      } catch {
        /* noop */
      }
    }, 200);
  }, [name, mediaUrls, entries.length]);

  const bookWidth = 320;
  const bookHeight = 440;

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage:
          "radial-gradient(circle, rgba(71,74,55,0.08) 1px, transparent 1.2px)",
        backgroundSize: "18px 18px",
      }}
    >
      <div className="mx-auto w-full max-w-[480px] min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 pt-5 pb-4">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) navigate(-1);
              else navigate("/");
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#474a37] hover:bg-black/5 transition-colors relative z-10"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-sans text-[#474a37] text-base tracking-[0.25em]">
            SNAP GUESTBOOK
          </h1>
          <div className="w-9" />
        </header>

        {/* PHOTOBOOK */}
        <section className="px-3 pb-6 flex flex-col items-center">
          <p className="text-[10px] tracking-[0.4em] text-[#8a8d70] uppercase mb-2">
            Digital Photobook
          </p>
          <p className="font-serif text-[#6b6e55] text-xs mb-5">
            드래그하여 페이지를 넘겨보세요
          </p>

          <div
            className="rounded-sm"
            style={{
              filter: "drop-shadow(0 12px 28px rgba(71,74,55,0.18))",
            }}
          >
            <HTMLFlipBook
              key={`book-${entries.length}`}
              ref={bookRef}
              width={bookWidth}
              height={bookHeight}
              size="fixed"
              minWidth={280}
              maxWidth={400}
              minHeight={380}
              maxHeight={520}
              maxShadowOpacity={0.6}
              showCover={true}
              mobileScrollSupport={true}
              drawShadow={true}
              flippingTime={700}
              usePortrait={true}
              startZIndex={0}
              autoSize={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={20}
              showPageCorners={true}
              disableFlipByClick={false}
              startPage={0}
              style={{}}
              className=""
            >
              {[
                <Cover key="cover" heroUrl={heroUrl} />,
                ...(entries.length === 0
                  ? [<EmptyPage key="empty" />]
                  : entries.map((entry, i) => (
                      <GuestPage key={`g-${entry.id}`} entry={entry} index={i} />
                    ))),
              ]}
            </HTMLFlipBook>
          </div>

          <p className="mt-4 text-xs text-[#8a8d70]">
            총 {entries.length}개의 기록
          </p>
        </section>

        {/* DIVIDER */}
        <div className="px-6 my-2">
          <div className="h-px bg-gradient-to-r from-transparent via-[#474a37]/15 to-transparent" />
        </div>

        {/* UPLOAD AREA */}
        <section className="px-6 pt-4 pb-10 space-y-6">
          <div className="text-center">
            <p className="text-[10px] tracking-[0.4em] text-[#8a8d70] uppercase mb-2">
              Leave Your Memory
            </p>
            <h2 className="font-serif text-[#474a37] text-lg">
              우리들의 페이지를 채워주세요
            </h2>
          </div>

          <div>
            <label className="block text-xs text-[#6b6e55] mb-2 tracking-wider">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              maxLength={20}
              className="w-full bg-transparent border-0 border-b border-[#474a37]/25 focus:border-[#474a37] focus:outline-none focus:ring-0 text-[#474a37] placeholder:text-[#474a37]/35 py-2 text-sm transition-colors"
            />
          </div>

          {/* Media upload */}
          <div>
            <label className="block text-xs text-[#6b6e55] mb-2 tracking-wider">
              사진/동영상 · 최대 {MAX_MEDIA}장 ({mediaFiles.length}/{MAX_MEDIA})
            </label>
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleMediaChange}
              />
              <div className="border-2 border-dashed border-[#474a37]/25 rounded-lg py-8 px-4 text-center hover:bg-black/[0.03] transition">
                <ImagePlus className="w-8 h-8 mx-auto mb-2 text-[#474a37]" />
                <p className="text-sm text-[#474a37]">사진/동영상 추가하기</p>
                <p className="text-[11px] text-[#6b6e55] mt-1">
                  최대 {MAX_MEDIA}장까지 업로드 가능
                </p>
              </div>
            </label>

            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {mediaUrls.map((url, idx) => (
                  <div
                    key={url}
                    className="relative aspect-square rounded overflow-hidden border border-[#474a37]/15"
                  >
                    <img src={url} alt={`media-${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeMedia(idx)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white"
                      aria-label="삭제"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-md font-medium tracking-[0.2em] text-sm transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              backgroundColor: "#d8e592",
              color: "#3d4225",
              boxShadow: "0 6px 18px rgba(216,229,146,0.25)",
            }}
          >
            올리기
          </button>
        </section>
      </div>
    </div>
  );
};

export default SnapGuestbook;
