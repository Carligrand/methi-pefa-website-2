import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Sermon = {
  id?: string; title: string; speaker: string; preached_on: string;
  scripture: string; description: string; video_url: string; thumbnail_url: string;
  tags: string[]; published: boolean;
};

const blank = (): Sermon => ({
  title: "", speaker: "", preached_on: new Date().toISOString().slice(0, 10),
  scripture: "", description: "", video_url: "", thumbnail_url: "", tags: [], published: true,
});

const SermonsAdmin = () => {
  const [list, setList] = useState<Sermon[]>([]);

  const load = async () => {
    const { data } = await supabase.from("sermons").select("*").order("preached_on", { ascending: false });
    setList((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (s: Sermon) => {
    const payload = { ...s };
    let res;
    if (payload.id) res = await supabase.from("sermons").update(payload).eq("id", payload.id);
    else res = await supabase.from("sermons").insert(payload);
    if (res.error) toast.error(res.error.message); else { toast.success("Saved"); load(); }
  };
  const remove = async (id?: string) => {
    if (!id || !confirm("Delete sermon?")) return;
    const { error } = await supabase.from("sermons").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const update = (idx: number, patch: Partial<Sermon>) => {
    const c = [...list]; c[idx] = { ...c[idx], ...patch }; setList(c);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-primary">Sermons Archive</h1>
        <Button onClick={() => setList([blank(), ...list])}><Plus className="w-4 h-4 mr-1" /> New Sermon</Button>
      </div>
      <div className="space-y-4">
        {list.map((s, idx) => (
          <div key={s.id ?? `new-${idx}`} className="p-5 rounded-xl bg-card border border-border space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label>Title</Label><Input value={s.title} onChange={(e) => update(idx, { title: e.target.value })} /></div>
              <div><Label>Speaker</Label><Input value={s.speaker} onChange={(e) => update(idx, { speaker: e.target.value })} /></div>
              <div><Label>Date</Label><Input type="date" value={s.preached_on ?? ""} onChange={(e) => update(idx, { preached_on: e.target.value })} /></div>
              <div><Label>Scripture</Label><Input value={s.scripture ?? ""} onChange={(e) => update(idx, { scripture: e.target.value })} /></div>
              <div><Label>Video URL (YouTube)</Label><Input value={s.video_url ?? ""} onChange={(e) => update(idx, { video_url: e.target.value })} /></div>
              <div><Label>Thumbnail URL</Label><Input value={s.thumbnail_url ?? ""} onChange={(e) => update(idx, { thumbnail_url: e.target.value })} /></div>
              <div><Label>Tags (comma-separated)</Label><Input value={(s.tags ?? []).join(", ")} onChange={(e) => update(idx, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} /></div>
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={s.published} onChange={(e) => update(idx, { published: e.target.checked })} />
                  Published
                </label>
              </div>
            </div>
            <div><Label>Description</Label><Textarea rows={3} value={s.description ?? ""} onChange={(e) => update(idx, { description: e.target.value })} /></div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => save(s)}>Save</Button>
              {s.id && <Button size="sm" variant="outline" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>}
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-muted-foreground">No sermons yet. Click "New Sermon" to add one.</p>}
      </div>
    </div>
  );
};
export default SermonsAdmin;
