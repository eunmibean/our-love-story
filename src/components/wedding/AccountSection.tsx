import { useState } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { toast } from "sonner";

interface Account {
  bank: string;
  number: string;
  holder: string;
}

const groomAccounts: Account[] = [
  { bank: "카카오뱅크", number: "3333-10-5027520", holder: "신랑: 김종재" },
  { bank: "국민은행", number: "666225-90-124634", holder: "신랑아버지: 김백배" },
  { bank: "농협은행", number: "1110-12-297646", holder: "신랑어머니: 이금자" },
];

const brideAccounts: Account[] = [
  { bank: "카카오뱅크", number: "3333-27-6198448", holder: "신부: 전민정" },
  { bank: "농협은행", number: "352-2320-5433-13", holder: "신부아버지: 전종호" },
  { bank: "농협은행", number: "302-0603-8765-51", holder: "신부어머니: 이영신" },
];

const AccountGroup = ({ title, accounts }: { title: string; accounts: Account[] }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (account: Account) => {
    const key = account.number + account.holder;
    navigator.clipboard.writeText(account.number);
    setCopied(key);
    toast.success("계좌번호가 복사되었습니다");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-card/50 transition-colors"
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown className={`h-4 w-4 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-border divide-y divide-border">
          {accounts.map((acc) => {
            const key = acc.number + acc.holder;
            return (
              <div key={key} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{acc.bank}</p>
                  <p className="text-sm text-foreground">{acc.number}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{acc.holder}</p>
                </div>
                <button
                  onClick={() => handleCopy(acc)}
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  {copied === key ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4 text-primary" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AccountSection = () => {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} className={`px-6 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{paddingBottom: "20px"}}>
      <h2 className="font-serif text-lg text-center mb-2 text-foreground">축의금 안내</h2>
      <p className="text-xs text-center text-muted-foreground mb-6">마음을 전해주시는 분들을 위해 준비했습니다</p>
      <div className="space-y-3">
        <AccountGroup title="신랑측 계좌" accounts={groomAccounts} />
        <AccountGroup title="신부측 계좌" accounts={brideAccounts} />
      </div>
    </section>
  );
};

export default AccountSection;
