import { NavLink, Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Settings, User as UserIcon, BookOpen, Users, Mic,
  Heart, CalendarDays, Image as ImageIcon, ListOrdered, ShieldCheck, LogOut, Cross, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
  { to: "/admin/bishop", label: "Bishop Profile", icon: UserIcon },
  { to: "/admin/history", label: "History", icon: BookOpen },
  { to: "/admin/pastors", label: "Past Pastors", icon: Users },
  { to: "/admin/sermons", label: "Sermons", icon: Mic },
  { to: "/admin/ministries", label: "Ministries", icon: Heart },
  { to: "/admin/events", label: "Ministry Events", icon: CalendarDays },
  { to: "/admin/gallery", label: "Ministry Gallery", icon: ImageIcon },
  { to: "/admin/order", label: "Order of Service", icon: ListOrdered },
];

export const AdminLayout = () => {
  const { user, loading, isAdmin, isITAdmin, signOut, roles } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="font-display text-2xl text-primary mb-2">No admin access</h2>
          <p className="text-muted-foreground mb-4">Your account doesn't have an admin role yet. Ask the IT Admin to assign one.</p>
          <Button onClick={signOut} variant="outline">Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-primary text-primary-foreground flex-col hidden md:flex">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-primary-foreground/10">
          <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
            <Cross className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display text-base">Methi PEFA Admin</div>
        </Link>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive ? "bg-accent text-primary font-semibold" : "hover:bg-primary-foreground/10"
                )
              }
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          ))}
          {isITAdmin && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive ? "bg-accent text-primary font-semibold" : "hover:bg-primary-foreground/10"
                )
              }
            >
              <ShieldCheck className="w-4 h-4" />
              Users & Roles
            </NavLink>
          )}
        </nav>
        <div className="p-3 border-t border-primary-foreground/10 space-y-2">
          <div className="text-xs text-primary-foreground/70 px-2">
            {user.email}
            <div className="mt-1 flex flex-wrap gap-1">
              {roles.map((r) => (
                <span key={r} className="text-[10px] uppercase tracking-wider bg-accent/20 text-accent px-1.5 py-0.5 rounded">{r}</span>
              ))}
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 text-xs px-2 py-1.5 rounded hover:bg-primary-foreground/10">
            <Home className="w-3.5 h-3.5" /> View site
          </Link>
          <button onClick={signOut} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded hover:bg-primary-foreground/10 w-full">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
          <div className="font-display">Methi PEFA Admin</div>
          <button onClick={signOut} className="text-xs">Sign out</button>
        </div>
        <div className="p-6 md:p-10 max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
