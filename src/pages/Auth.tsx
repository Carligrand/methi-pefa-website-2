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
  fullName: z.string().trim().min(2, "Enter your full name").max(100),

  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(255),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),

  churchBranch: z.string().trim().min(2),
});

const DEFAULT_BRANCH = "PEFA METHI CATHEDRAL BRANCH";

const Auth = () => {
  const { user, signIn, loading } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");

  const [churchBranch, setChurchBranch] =
    useState(DEFAULT_BRANCH);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title =
      "PEFA METHI CATHEDRAL BRANCH — Authentication";
  }, []);

  if (!loading && user) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (mode === "signin") {
      const parsed = schema.pick({
        email: true,
        password: true,
      }).safeParse({
        email,
        password,
      });

      if (!parsed.success) {
        toast.error(
          parsed.error.errors[0].message
        );
        return;
      }

      setSubmitting(true);

      const { error } = await signIn(
        parsed.data.email,
        parsed.data.password
      );

      if (error) {
        toast.error(error);
      } else {
        toast.success("Welcome back");
      }

      setSubmitting(false);

      return;
    }

    const parsed = schema.safeParse({
      fullName,
      email,
      password,
      churchBranch,
    });

    if (!parsed.success) {
      toast.error(
        parsed.error.errors[0].message
      );
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,

      password: parsed.data.password,

      options: {
        emailRedirectTo: `${window.location.origin}/admin`,

        data: {
          full_name: parsed.data.fullName,
          church_branch:
            parsed.data.churchBranch,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "Account created successfully. Await approval from the Technical Admin."
      );

      setMode("signin");

      setPassword("");
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-soft p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elegant p-8 border border-border">

        <Link
          to="/"
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-burgundy flex items-center justify-center">
            <Cross className="w-5 h-5 text-primary-foreground" />
          </div>

          <div>
            <div className="font-display text-lg font-semibold text-primary">
              PEFA METHI CATHEDRAL BRANCH
            </div>

            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Member & Admin Portal
            </div>
          </div>
        </Link>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 py-2 text-sm rounded-md transition ${
              mode === "signin"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-sm rounded-md transition ${
              mode === "signup"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4"
        >

          {mode === "signup" && (
            <>
              <div>
                <Label htmlFor="name">
                  Full Name
                </Label>

                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="church">
                  Church Branch
                </Label>

                <Input
                  id="church"
                  value={churchBranch}
                  onChange={(e) =>
                    setChurchBranch(
                      e.target.value
                    )
                  }
                  required
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">
              Email Address
            </Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="password">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
              }
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>

        {mode === "signup" && (
          <p className="text-xs text-muted-foreground mt-4">
            Newly created accounts are reviewed
            by the Technical Admin before
            receiving elevated permissions.
          </p>
        )}

        <Link
          to="/"
          className="block text-center text-sm text-muted-foreground mt-6 hover:text-accent transition"
        >
          ← Back to Website
        </Link>
      </div>
    </div>
  );
};

export default Auth;