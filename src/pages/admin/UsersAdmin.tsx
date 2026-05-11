import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Role = "bishop" | "it_admin" | "editor";
type Profile = { id: string; email: string | null; full_name: string | null };
type RoleRow = { id: string; user_id: string; role: Role };

const UsersAdmin = () => {
  const { isITAdmin, loading } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);

  const load = async () => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("user_roles").select("*"),
    ]);
    setProfiles((p as any) ?? []);
    setRoles((r as any) ?? []);
  };
  useEffect(() => { if (isITAdmin) load(); }, [isITAdmin]);

  if (loading) return <p>Loading…</p>;
  if (!isITAdmin) return <Navigate to="/admin" replace />;

  const assign = async (user_id: string, role: Role) => {
    const { error } = await supabase.from("user_roles").insert({ user_id, role });
    if (error) toast.error(error.message); else { toast.success("Role assigned"); load(); }
  };

  const removeRole = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-primary mb-2">Users & Roles</h1>
      <p className="text-muted-foreground mb-6">
        New users sign themselves up at <span className="font-mono">/auth</span>, then you assign them a role here.
        Bishop and IT Admin can edit all content; IT Admin additionally manages users and roles.
      </p>
      <div className="space-y-4">
        {profiles.map((p) => {
          const userRoles = roles.filter((r) => r.user_id === p.id);
          return (
            <div key={p.id} className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold text-primary">{p.full_name || p.email}</div>
                  <div className="text-xs text-muted-foreground">{p.email}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {userRoles.length === 0 && <span className="text-xs text-muted-foreground">No roles</span>}
                    {userRoles.map((r) => (
                      <span key={r.id} className="text-xs bg-accent/20 text-primary px-2 py-1 rounded inline-flex items-center gap-1">
                        {r.role}
                        <button onClick={() => removeRole(r.id)} className="hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["bishop", "it_admin", "editor"] as Role[]).map((r) => (
                    <Button key={r} size="sm" variant="outline" disabled={userRoles.some((x) => x.role === r)} onClick={() => assign(p.id, r)}>
                      + {r}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default UsersAdmin;
