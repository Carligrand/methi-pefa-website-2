import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Event = { id?: string; ministry_id: string; title: string; event_date: string; description: string };

const EventsAdmin = () => {
  const [list, setList] = useState<Event[]>([]);
  const [ministries, setMinistries] = useState<{ id: string; name: string }[]>([]);

  const load = async () => {
    const [{ data: e }, { data: m }] = await Promise.all([
      supabase.from("ministry_events").select("*").order("event_date", { ascending: false }),
      supabase.from("ministries").select("id,name").order("id"),
    ]);
    setList((e as any) ?? []); setMinistries((m as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (ev: Event) => {
    const payload = { ...ev };
    let res;
    if (payload.id) res = await supabase.from("ministry_events").update(payload).eq("id", payload.id);
    else res = await supabase.from("ministry_events").insert(payload);
    if (res.error) toast.error(res.error.message); else { toast.success("Saved"); load(); }
  };
  const remove = async (id?: string) => {
    if (!id || !confirm("Delete event?")) return;
    const { error } = await supabase.from("ministry_events").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const update = (i: number, patch: Partial<Event>) => { const c = [...list]; c[i] = { ...c[i], ...patch }; setList(c); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-primary">Ministry Events</h1>
        <Button onClick={() => setList([{ ministry_id: ministries[0]?.id ?? "men", title: "", event_date: new Date().toISOString().slice(0, 10), description: "" }, ...list])}>
          <Plus className="w-4 h-4 mr-1" /> New Event
        </Button>
      </div>
      <div className="space-y-4">
        {list.map((ev, i) => (
          <div key={ev.id ?? `new-${i}`} className="p-5 rounded-xl bg-card border border-border space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label>Ministry</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={ev.ministry_id} onChange={(e) => update(i, { ministry_id: e.target.value })}>
                  {ministries.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div><Label>Title</Label><Input value={ev.title} onChange={(e) => update(i, { title: e.target.value })} /></div>
              <div><Label>Date</Label><Input type="date" value={ev.event_date} onChange={(e) => update(i, { event_date: e.target.value })} /></div>
            </div>
            <div><Label>Description</Label><Textarea rows={2} value={ev.description ?? ""} onChange={(e) => update(i, { description: e.target.value })} /></div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => save(ev)}>Save</Button>
              {ev.id && <Button size="sm" variant="outline" onClick={() => remove(ev.id)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EventsAdmin;
