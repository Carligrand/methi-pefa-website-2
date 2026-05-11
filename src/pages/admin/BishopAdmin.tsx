import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Schedule = { day: string; times: string };
type Row = {
  id?: string; name: string; title: string; photo_url: string; bio: string;
  phone: string; email: string; verse: string; verse_reference: string;
  schedule: Schedule[];
};

const BishopAdmin = () => {
  const [row, setRow] = useState<Row | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.from("bishop_profile").select("*").limit(1).maybeSingle()
      .then(({ data }) => setRow((data as any) ?? { name: "", title: "", photo_url: "", bio: "", phone: "", email: "", verse: "", verse_reference: "", schedule: [] }));
  }, []);

  const upload = async (file: File) => {
    setUploading(true);
    const path = `bishop/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("bishop-photos").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("bishop-photos").getPublicUrl(path);
    setRow((r) => r && { ...r, photo_url: publicUrl });
    setUploading(false);
    toast.success("Photo uploaded");
  };

  const save = async () => {
    if (!row) return;
    const payload = { ...row };
    let res;
    if (payload.id) res = await supabase.from("bishop_profile").update(payload).eq("id", payload.id);
    else res = await supabase.from("bishop_profile").insert(payload);
    if (res.error) toast.error(res.error.message); else toast.success("Saved");
  };

  if (!row) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-primary mb-6">Bishop Profile</h1>
      <div className="space-y-4 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Name</Label><Input value={row.name} onChange={(e) => setRow({ ...row, name: e.target.value })} /></div>
          <div><Label>Title</Label><Input value={row.title} onChange={(e) => setRow({ ...row, title: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={row.phone ?? ""} onChange={(e) => setRow({ ...row, phone: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={row.email ?? ""} onChange={(e) => setRow({ ...row, email: e.target.value })} /></div>
          <div><Label>Verse</Label><Input value={row.verse ?? ""} onChange={(e) => setRow({ ...row, verse: e.target.value })} /></div>
          <div><Label>Verse reference</Label><Input value={row.verse_reference ?? ""} onChange={(e) => setRow({ ...row, verse_reference: e.target.value })} /></div>
        </div>
        <div>
          <Label>Bio</Label>
          <Textarea rows={4} value={row.bio ?? ""} onChange={(e) => setRow({ ...row, bio: e.target.value })} />
        </div>
        <div>
          <Label>Photo</Label>
          <div className="flex items-center gap-4">
            {row.photo_url && <img src={row.photo_url} alt="Bishop" className="w-24 h-24 rounded-lg object-cover border" />}
            <Input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </div>
          <Input className="mt-2" placeholder="Or paste image URL" value={row.photo_url ?? ""} onChange={(e) => setRow({ ...row, photo_url: e.target.value })} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>Weekly Schedule</Label>
            <Button size="sm" variant="outline" onClick={() => setRow({ ...row, schedule: [...row.schedule, { day: "", times: "" }] })}><Plus className="w-3.5 h-3.5 mr-1" />Add</Button>
          </div>
          <div className="space-y-2 mt-2">
            {row.schedule.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder="Day" value={s.day} onChange={(e) => { const c = [...row.schedule]; c[i].day = e.target.value; setRow({ ...row, schedule: c }); }} />
                <Input placeholder="Times" value={s.times} onChange={(e) => { const c = [...row.schedule]; c[i].times = e.target.value; setRow({ ...row, schedule: c }); }} />
                <Button size="sm" variant="outline" onClick={() => setRow({ ...row, schedule: row.schedule.filter((_, x) => x !== i) })}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={save}>Save Profile</Button>
      </div>
    </div>
  );
};
export default BishopAdmin;
