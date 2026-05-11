import { Smartphone, CreditCard, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PAYBILL = "123456";
const ACCOUNT = "PEFA Methi Cathedral Branch";

export const Donate = () => {
  const copy = (v: string, label: string) => {
    navigator.clipboard.writeText(v);
    toast.success(`${label} copied`);
  };
  return (
    <section id="give" className="py-24 bg-gradient-burgundy text-primary-foreground">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Partner With Us</p>
          <h2 className="font-display text-4xl md:text-5xl">Give & Sow</h2>
          <p className="mt-4 text-primary-foreground/85 max-w-2xl mx-auto">
            Your generosity fuels worship, missions, discipleship, and care for the vulnerable. Thank you.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-background/10 backdrop-blur rounded-2xl p-8 border border-accent/30">
            <div className="flex items-center gap-3 mb-5">
              <Smartphone className="w-7 h-7 text-accent" />
              <h3 className="font-display text-2xl">M-Pesa Paybill</h3>
            </div>
            <dl className="space-y-3">
              <div className="flex justify-between items-center bg-background/10 rounded-lg p-3">
                <div>
                  <dt className="text-xs uppercase tracking-widest text-accent">Paybill</dt>
                  <dd className="font-display text-2xl">{PAYBILL}</dd>
                </div>
                <Button size="sm" variant="ghost" onClick={() => copy(PAYBILL, "Paybill")} className="text-primary-foreground hover:bg-background/20">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center bg-background/10 rounded-lg p-3">
                <div>
                  <dt className="text-xs uppercase tracking-widest text-accent">Account</dt>
                  <dd className="font-display text-2xl">{ACCOUNT}</dd>
                </div>
                <Button size="sm" variant="ghost" onClick={() => copy(ACCOUNT, "Account")} className="text-primary-foreground hover:bg-background/20">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </dl>
          </div>

          <div className="bg-background/10 backdrop-blur rounded-2xl p-8 border border-accent/30">
            <div className="flex items-center gap-3 mb-5">
              <CreditCard className="w-7 h-7 text-accent" />
              <h3 className="font-display text-2xl">Card Donations</h3>
            </div>
            <p className="text-primary-foreground/85 mb-5">
              Secure card giving (Visa, Mastercard) is coming soon. In the meantime, please use M-Pesa or contact the church office.
            </p>
            <Button disabled className="bg-accent/40 text-accent-foreground cursor-not-allowed">Coming soon</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
