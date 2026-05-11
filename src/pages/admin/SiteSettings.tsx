import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SiteSettings = () => {
  const [row, setRow] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }) => setRow(data ?? {}));
  }, []);

  const set = (k: string, v: string) => setRow((r: any) => ({ ...r, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload = { ...row };
    let res;
    if (payload.id) res = await supabase.from("site_settings").update(payload).eq("id", payload.id);
    else res = await supabase.from("site_settings").insert(payload);
    setSaving(false);
    if (res.error) toast.error(res.error.message); else toast.success("Saved");
  };

  if (!row) return <p>Loading…</p>;
  const fields: [string, string, string?][] = [
    ["youtube_channel_id", "YouTube Channel ID"],
    ["youtube_live_video_id", "YouTube Live Video ID"],
    ["facebook_page_url", "Facebook Page URL"],
    ["mpesa_paybill", "M-Pesa Paybill"],
    ["mpesa_account", "M-Pesa Account Number"],
    ["card_donation_url", "Card Donation URL"],
    ["contact_phone", "Contact Phone"],
    ["contact_email", "Contact Email"],
    ["contact_address", "Address"],
  ];
  return (
    <div>
      <h1 className="font-display text-3xl text-primary mb-6">Site Settings</h1>
      <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
        {fields.map(([k, label]) => (
          <div key={k}>
            <Label>{label}</Label>
            <Input value={row[k] ?? ""} onChange={(e) => set(k, e.target.value)} />
          </div>
        ))}
      </div>
      <Button onClick={save} disabled={saving} className="mt-6">{saving ? "Saving..." : "Save Settings"}</Button>
    </div>
  );
};
export default SiteSettings;
