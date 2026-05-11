import { useState } from "react";
import { Menu, X, Cross } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#welcome", label: "Welcome" },
  { href: "#about", label: "About" },
  { href: "#faith", label: "Faith" },
  { href: "#live", label: "Live" },
  { href: "#calendar", label: "Calendar" },
  { href: "#departments", label: "Ministries" },
  { href: "#devotionals", label: "Devotionals" },
  { href: "#bishop", label: "Bishop" },
  { href: "#give", label: "Give" },
];

export const Navbar = ({ season }: { season: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <a href="#welcome" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-burgundy flex items-center justify-center shadow-soft">
            <Cross className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-primary">Methi PEFA</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Church · {season}</div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-smooth">
              {l.label}
            </a>
          ))}
        </nav>
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-primary" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div className={cn("lg:hidden overflow-hidden transition-all", open ? "max-h-96" : "max-h-0")}>
        <nav className="container flex flex-col py-4 gap-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium py-1">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};
