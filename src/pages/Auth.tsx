import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cross } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(100),
});

const Auth = () => {
  const { user, signIn, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { document.title = "Admin Sign In — Methi PEFA"; }, []);

  if (!loading && user) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSubmitting(true);
    if (mode === "signin") {
      const { error } = await signIn(parsed.data.email, parsed.data.password);
      if (error) toast.error(error); else toast.success("Welcome back");
    } else {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${window.location.origin}/admin`, data: { full_name: fullName } },
      });
      if (error) toast.error(error.message);
      else toast.success("Account created. Ask the IT Admin to assign you a role.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-soft p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elegant p-8 border border-border">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-burgundy flex items-center justify-center">
            <Cross className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold text-primary">Methi PEFA</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin Portal</div>
          </div>
        </Link>
        <div className="flex gap-2 mb-6">
          <button onClick={() => setMode("signin")} className={`flex-1 py-2 text-sm rounded-md ${mode === "signin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Sign In</button>
          <button onClick={() => setMode("signup")} className={`flex-1 py-2 text-sm rounded-md ${mode === "signup" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Sign Up</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>
        {mode === "signup" && (
          <p className="text-xs text-muted-foreground mt-4">After signing up, an IT Admin must grant you a role before you can access the admin dashboard.</p>
        )}
        <Link to="/" className="block text-center text-sm text-muted-foreground mt-6 hover:text-accent">← Back to website</Link>
      </div>
    </div>
  );
};

export default Auth;
