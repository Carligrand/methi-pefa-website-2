import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Leader = { name: string; role: string; image_url?: string };
type Ministry = { id: string; name: string; tagline: string; mission: string; vision: string; support_info: string; leaders: Leader[]; cover_image_url: string };

const MinistriesAdmin = () => {
  const [list, setList] = useState<Ministry[]>([]);
  const [active, setActive] = useState<string>("");

  const load = async () => {
    const { data } = await supabase.from("ministries").select("*").order("id");
    setList((data as any) ?? []);
    if (data && data.length && !active) setActive(data[0].id);
  };
  useEffect(() => { load(); }, []);

  const current = list.find((m) => m.id === active);
  const update = (patch: Partial<Ministry>) => {
    setList(list.map((m) => m.id === active ? { ...m, ...patch } : m));
  };

  const save = async () => {
    if (!current) return;
    const { error } = await supabase.from("ministries").update(current).eq("id", current.id);
    if (error) toast.error(error.message); else toast.success("Saved");
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-primary mb-6">Ministries</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {list.map((m) => (
          <button key={m.id} onClick={() => setActive(m.id)} className={`px-4 py-2 rounded-md text-sm ${active === m.id ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>{m.name}</button>
        ))}
      </div>
      {current && (
        <div className="space-y-4 max-w-3xl">
          <div><Label>Name</Label><Input value={current.name} onChange={(e) => update({ name: e.target.value })} /></div>
          <div><Label>Tagline</Label><Input value={current.tagline ?? ""} onChange={(e) => update({ tagline: e.target.value })} /></div>
          <div><Label>Mission</Label><Textarea rows={3} value={current.mission ?? ""} onChange={(e) => update({ mission: e.target.value })} /></div>
          <div><Label>Vision</Label><Textarea rows={3} value={current.vision ?? ""} onChange={(e) => update({ vision: e.target.value })} /></div>
          <div><Label>How to Support</Label><Textarea rows={3} value={current.support_info ?? ""} onChange={(e) => update({ support_info: e.target.value })} /></div>
          <div><Label>Cover Image URL</Label><Input value={current.cover_image_url ?? ""} onChange={(e) => update({ cover_image_url: e.target.value })} /></div>
          <div>
            <div className="flex items-center justify-between">
              <Label>Leaders</Label>
              <Button size="sm" variant="outline" onClick={() => update({ leaders: [...(current.leaders ?? []), { name: "", role: "", image_url: "" }] })}>Add Leader</Button>
            </div>
            <div className="space-y-2 mt-2">
              {(current.leaders ?? []).map((l, i) => (
                <div key={i} className="grid md:grid-cols-4 gap-2">
                  <Input placeholder="Name" value={l.name} onChange={(e) => { const c = [...current.leaders]; c[i].name = e.target.value; update({ leaders: c }); }} />
                  <Input placeholder="Role" value={l.role} onChange={(e) => { const c = [...current.leaders]; c[i].role = e.target.value; update({ leaders: c }); }} />
                  <Input placeholder="Photo URL" value={l.image_url ?? ""} onChange={(e) => { const c = [...current.leaders]; c[i].image_url = e.target.value; update({ leaders: c }); }} />
                  <Button size="sm" variant="outline" onClick={() => update({ leaders: current.leaders.filter((_, x) => x !== i) })}>Remove</Button>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={save}>Save Ministry</Button>
        </div>
      )}
    </div>
  );
};
export default MinistriesAdmin;
