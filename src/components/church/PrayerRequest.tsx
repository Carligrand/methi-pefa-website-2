import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export const PrayerRequest = () => {
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Your prayer request has been received. We're standing with you.");
      (e.target as HTMLFormElement).reset();
      setSubmitting(false);
    }, 600);
  };
  return (
    <section id="prayer" className="py-24 bg-background">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <Heart className="w-10 h-10 text-accent mx-auto mb-4" />
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">We're Praying With You</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary">Submit a Prayer Request</h2>
        </div>
        <form onSubmit={onSubmit} className="bg-card rounded-2xl border border-border/60 shadow-soft p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name (optional)</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="request">Your prayer request</Label>
            <Textarea id="request" required rows={6} placeholder="Share what's on your heart..." />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="anon" />
            <Label htmlFor="anon" className="text-sm font-normal text-muted-foreground">Keep my request confidential to the pastoral team</Label>
          </div>
          <Button type="submit" disabled={submitting} size="lg" className="bg-gradient-burgundy text-primary-foreground w-full sm:w-auto shadow-soft">
            {submitting ? "Sending..." : "Send Prayer Request"}
          </Button>
        </form>
      </div>
    </section>
  );
};
