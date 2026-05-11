import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Pastor = { id?: string; name: string; years: string; title: string; accomplishments: string[]; sort_order: number };

const PastorsAdmin = () => {
  const [list, setList] = useState<Pastor[]>([]);

  const load = async () => {
    const { data } = await supabase.from("past_pastors").select("*").order("sort_order");
    setList((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (p: Pastor) => {
    const payload = { ...p };
    let res;
    if (payload.id) res = await supabase.from("past_pastors").update(payload).eq("id", payload.id);
    else res = await supabase.from("past_pastors").insert(payload);
    if (res.error) toast.error(res.error.message); else { toast.success("Saved"); load(); }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this pastor?")) return;
    const { error } = await supabase.from("past_pastors").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const addNew = () => setList([...list, { name: "", years: "", title: "", accomplishments: [""], sort_order: list.length + 1 }]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-primary">Past Pastors</h1>
        <Button onClick={addNew}><Plus className="w-4 h-4 mr-1" /> Add Pastor</Button>
      </div>
      <div className="space-y-6">
        {list.map((p, idx) => (
          <div key={p.id ?? `new-${idx}`} className="p-5 rounded-xl bg-card border border-border space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <div><Label>Name</Label><Input value={p.name} onChange={(e) => { const c = [...list]; c[idx].name = e.target.value; setList(c); }} /></div>
              <div><Label>Years</Label><Input value={p.years} onChange={(e) => { const c = [...list]; c[idx].years = e.target.value; setList(c); }} /></div>
              <div><Label>Title</Label><Input value={p.title} onChange={(e) => { const c = [...list]; c[idx].title = e.target.value; setList(c); }} /></div>
            </div>
            <div>
              <Label>Accomplishments (one per line)</Label>
              <Textarea rows={4} value={p.accomplishments.join("\n")} onChange={(e) => { const c = [...list]; c[idx].accomplishments = e.target.value.split("\n").filter(Boolean); setList(c); }} />
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div><Label>Sort order</Label><Input type="number" value={p.sort_order} onChange={(e) => { const c = [...list]; c[idx].sort_order = +e.target.value; setList(c); }} /></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => save(p)}>Save</Button>
              {p.id && <Button size="sm" variant="outline" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PastorsAdmin;
