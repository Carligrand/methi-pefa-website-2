import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Photo = { id: string; ministry_id: string; image_url: string; caption: string | null };

const GalleryAdmin = () => {
  const [ministries, setMinistries] = useState<{ id: string; name: string }[]>([]);
  const [active, setActive] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadMinistries = async () => {
    const { data } = await supabase.from("ministries").select("id,name").order("id");
    setMinistries((data as any) ?? []);
    if (data && data.length && !active) setActive(data[0].id);
  };
  const loadPhotos = async () => {
    if (!active) return;
    const { data } = await supabase.from("ministry_gallery").select("*").eq("ministry_id", active).order("created_at", { ascending: false });
    setPhotos((data as any) ?? []);
  };

  useEffect(() => { loadMinistries(); }, []);
  useEffect(() => { loadPhotos(); }, [active]);

  const upload = async (file: File) => {
    setUploading(true);
    const path = `${active}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("ministry-gallery").upload(path, file);
    if (upErr) { toast.error(upErr.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("ministry-gallery").getPublicUrl(path);
    const { error } = await supabase.from("ministry_gallery").insert({ ministry_id: active, image_url: publicUrl, caption });
    setUploading(false);
    if (error) toast.error(error.message); else { toast.success("Uploaded"); setCaption(""); loadPhotos(); }
  };

  const remove = async (p: Photo) => {
    if (!confirm("Delete photo?")) return;
    await supabase.from("ministry_gallery").delete().eq("id", p.id);
    loadPhotos();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-primary mb-6">Ministry Gallery</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {ministries.map((m) => (
          <button key={m.id} onClick={() => setActive(m.id)} className={`px-4 py-2 rounded-md text-sm ${active === m.id ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>{m.name}</button>
        ))}
      </div>
      <div className="p-5 rounded-xl bg-card border border-border mb-6 max-w-2xl">
        <Label>Upload photo</Label>
        <Input className="mb-2" placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <Input type="file" accept="image/*" disabled={uploading || !active} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((p) => (
          <div key={p.id} className="relative group">
            <img src={p.image_url} alt={p.caption ?? ""} className="w-full aspect-square object-cover rounded-lg border" />
            {p.caption && <p className="text-xs mt-1 text-muted-foreground">{p.caption}</p>}
            <button onClick={() => remove(p)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default GalleryAdmin;
