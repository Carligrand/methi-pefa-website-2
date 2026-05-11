import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const HistoryAdmin = () => {
  const [row, setRow] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("church_history").select("*").limit(1).maybeSingle().then(({ data }) => setRow(data ?? { intro: "", full_history: "" }));
  }, []);

  const save = async () => {
    setSaving(true);
    let res;
    if (row.id) res = await supabase.from("church_history").update({ intro: row.intro, full_history: row.full_history }).eq("id", row.id);
    else res = await supabase.from("church_history").insert({ intro: row.intro, full_history: row.full_history });
    setSaving(false);
    if (res.error) toast.error(res.error.message); else toast.success("History saved");
  };

  if (!row) return <p>Loading…</p>;
  return (
    <div>
      <h1 className="font-display text-3xl text-primary mb-2">Church History</h1>
      <p className="text-muted-foreground mb-6">Edit the intro shown on the homepage and the full history on the dedicated page.</p>
      <div className="space-y-4 max-w-3xl">
        <div>
          <Label>Short Intro (homepage)</Label>
          <Textarea rows={4} value={row.intro ?? ""} onChange={(e) => setRow({ ...row, intro: e.target.value })} />
        </div>
        <div>
          <Label>Full History (history page)</Label>
          <Textarea rows={20} value={row.full_history ?? ""} onChange={(e) => setRow({ ...row, full_history: e.target.value })} />
          <p className="text-xs text-muted-foreground mt-1">Use blank lines to separate paragraphs.</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
      </div>
    </div>
  );
};
export default HistoryAdmin;
