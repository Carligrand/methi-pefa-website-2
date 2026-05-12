import { createContext, useContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

type Role = "bishop" | "it_admin" | "editor";

export type AuthCtxType = {
  user: User | null;
  session: Session | null;
  roles: Role[];
  loading: boolean;
  isAdmin: boolean;
  isITAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

export const AuthCtx = createContext<AuthCtxType | undefined>(undefined);

export const useAuth = () => {
  const v = useContext(AuthCtx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};