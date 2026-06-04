import { useEffect } from "react";
import { Share2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Kakao: any;
  }
}

const WeddingFooter = () => {
  useEffect(() => {
    const key = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!key || !window.Kakao) return;
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(key);
    }
  }, []);

  const handleKakaoShare = () => {
    if (!window.Kakao?.Share) {
      toast("카카오 SDK가 로드되지 않았습니다");
      return;
    }
    const url = window.location.href;
    const imageUrl = import.meta.env.VITE_KAKAO_IMAGE_URL;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "김종재 ♥ 전민정 결혼합니다",
        description: "2026년 10월 10일 토요일 오후 4시 50분\n빌라드지디 안산 7층 그레이스켈리홀",
        imageUrl,
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      buttons: [
        {
          title: "청첩장 보기",
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      ],
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("링크가 복사되었습니다");
  };

  return (
    <footer className="px-6 py-10 text-center space-y-4">
      <div className="flex justify-center gap-3">
        <button
          onClick={handleKakaoShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FEE500] text-[#3C1E1E] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Share2 className="h-4 w-4" />
          카카오톡 공유
        </button>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/50 text-foreground text-sm font-medium hover:bg-card transition-colors border border-border"
        >
          <LinkIcon className="h-4 w-4" />
          링크 복사
        </button>
      </div>
      <p className="text-xs text-muted-foreground/40 pt-4">
        © 2026 은미콩
      </p>
    </footer>
  );
};

export default WeddingFooter;
