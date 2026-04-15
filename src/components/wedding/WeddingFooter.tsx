import { Share2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

const WeddingFooter = () => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("링크가 복사되었습니다");
  };

  const handleKakaoShare = () => {
    // Kakao SDK share - placeholder
    toast("카카오톡 공유 기능은 카카오 SDK 설정 후 사용 가능합니다");
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
        © 2025 Wedding Invitation
      </p>
    </footer>
  );
};

export default WeddingFooter;
