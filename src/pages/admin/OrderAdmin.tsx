import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Item = { time: string; item: string };
type Row = { id?: string; service_name: string; items: Item[] };

const OrderAdmin = () => {
  const [row, setRow] = useState<Row | null>(null);

  useEffect(() => {
    supabase.from("order_of_service").select("*").limit(1).maybeSingle()
      .then(({ data }) => setRow((data as any) ?? { service_name: "Sunday Service", items: [] }));
  }, []);

  const save = async () => {
    if (!row) return;
    const payload = { service_name: row.service_name, items: row.items };
    let res;
    if (row.id) res = await supabase.from("order_of_service").update(payload).eq("id", row.id);
    else res = await supabase.from("order_of_service").insert(payload);
    if (res.error) toast.error(res.error.message); else toast.success("Saved");
  };

  if (!row) return <p>Loading…</p>;
  return (
    <div>
      <h1 className="font-display text-3xl text-primary mb-6">Order of Service</h1>
      <div className="space-y-4 max-w-2xl">
        <div><Label>Service Name</Label><Input value={row.service_name} onChange={(e) => setRow({ ...row, service_name: e.target.value })} /></div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Items</Label>
            <Button size="sm" variant="outline" onClick={() => setRow({ ...row, items: [...row.items, { time: "", item: "" }] })}><Plus className="w-3.5 h-3.5 mr-1" />Add</Button>
          </div>
          <div className="space-y-2">
            {row.items.map((it, i) => (
              <div key={i} className="flex gap-2">
                <Input className="w-32" placeholder="Time" value={it.time} onChange={(e) => { const c = [...row.items]; c[i].time = e.target.value; setRow({ ...row, items: c }); }} />
                <Input placeholder="Item" value={it.item} onChange={(e) => { const c = [...row.items]; c[i].item = e.target.value; setRow({ ...row, items: c }); }} />
                <Button size="sm" variant="outline" onClick={() => setRow({ ...row, items: row.items.filter((_, x) => x !== i) })}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
};
export default OrderAdmin;
