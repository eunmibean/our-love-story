import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";
import { toast } from "sonner";

interface GuestMessage {
  author: string;
  content: string;
  colorIndex: number;
  timestamp: number;
}

const COLORS = [
  "bg-postit-0/80 text-olive-dark",
  "bg-postit-1/80 text-olive-dark",
  "bg-postit-2/80 text-olive-dark",
  "bg-postit-3/80 text-olive-dark",
  "bg-postit-4/80 text-olive-dark",
  "bg-postit-5/80 text-olive-dark",
];

const ROTATIONS = [
  "postit-rotate-1",
  "postit-rotate-2",
  "postit-rotate-3",
  "postit-rotate-4",
  "postit-rotate-5",
  "postit-rotate-6",
];

const GuestbookSection = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const { ref, isVisible } = useInView();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("guestbook_messages") || "[]");
    setMessages(stored);
  }, []);

  const handleSubmit = () => {
    if (!author.trim() || !content.trim()) {
      toast.error("이름과 메시지를 입력해주세요");
      return;
    }
    const newMsg: GuestMessage = {
      author: author.trim(),
      content: content.trim(),
      colorIndex: Math.floor(Math.random() * 6),
      timestamp: Date.now(),
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem("guestbook_messages", JSON.stringify(updated));
    setAuthor("");
    setContent("");
    toast.success("축하 메시지가 등록되었습니다");
  };

  return (
    <section ref={ref} className={`px-6 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <h2 className="font-serif text-lg text-center mb-6 text-foreground">축하 메시지</h2>

      {/* Input */}
      <div className="space-y-3 mb-8">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full bg-card/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="이름"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-card/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder="축하 메시지를 남겨주세요"
          rows={3}
        />
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-xl font-medium text-sm transition-colors"
          style={{ backgroundColor: "#a3bd7a", color: "#A4BE7B" }}
        >
          등록하기
        </button>
      </div>

      {/* Masonry grid */}
      <div className="columns-2 gap-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={msg.timestamp}
            className={`break-inside-avoid p-4 rounded-lg ${COLORS[msg.colorIndex]} ${ROTATIONS[i % 6]} shadow-sm`}
          >
            <p className="text-xs font-medium mb-1 opacity-70">{msg.author}</p>
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <p className="text-center text-muted-foreground/50 text-sm">아직 메시지가 없습니다</p>
      )}
    </section>
  );
};

export default GuestbookSection;
