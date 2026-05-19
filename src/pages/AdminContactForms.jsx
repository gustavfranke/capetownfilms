import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, X, Trash2, Save, Loader2, ChevronUp, ChevronDown } from "lucide-react";

const FIELD_TYPES = ["text", "email", "tel", "date", "textarea", "select"];
const STATUS_COLORS = { active: "bg-green-500/20 text-green-400", inactive: "bg-white/10 text-white/40" };

export default function AdminContactForms() {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const { data: forms = [] } = useQuery({
    queryKey: ["contactForms"],
    queryFn: () => base44.entities.ContactForm.list("-created_date"),
  });

  const handleNew = async () => {
    const f = await base44.entities.ContactForm.create({ title: "New Form", heading: "", subheading: "", fields: [], button_text: "Send", status: "active" });
    qc.invalidateQueries({ queryKey: ["contactForms"] });
    setEditing({ ...f });
  };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_date, updated_date, created_by, ...rest } = editing;
    await base44.entities.ContactForm.update(id, rest);
    qc.invalidateQueries({ queryKey: ["contactForms"] });
    setSaving(false);
  };

  const addField = () => {
    setEditing({ ...editing, fields: [...(editing.fields || []), { name: "", label: "", type: "text", placeholder: "", required: false, options: [] }] });
  };

  const updateField = (idx, key, val) => {
    const fields = [...(editing.fields || [])];
    fields[idx] = { ...fields[idx], [key]: val };
    setEditing({ ...editing, fields });
  };

  const removeField = (idx) => {
    setEditing({ ...editing, fields: editing.fields.filter((_, i) => i !== idx) });
  };

  const moveField = (idx, dir) => {
    const fields = [...(editing.fields || [])];
    const swap = idx + dir;
    if (swap < 0 || swap >= fields.length) return;
    [fields[idx], fields[swap]] = [fields[swap], fields[idx]];
    setEditing({ ...editing, fields });
  };

  return (
    <AdminLayout currentPage="AdminContactForms">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Contact Forms</h1>
          <p className="text-white/40 text-sm mt-1">Manage lead capture forms</p>
        </div>
        <Button onClick={handleNew} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> New Form
        </Button>
      </div>

      {!editing ? (
        <div className="space-y-3">
          {forms.map(form => (
            <div key={form.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{form.title}</p>
                <p className="text-white/40 text-sm">{form.heading}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[form.status] || STATUS_COLORS.inactive}`}>{form.status}</span>
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white" onClick={() => setEditing({ ...form })}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {forms.length === 0 && <div className="text-center py-16 text-white/30">No forms yet.</div>}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white text-sm flex items-center gap-2"><X className="w-4 h-4" /> Close</button>
            <Button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {[
              { key: "title", label: "Title" }, { key: "heading", label: "Heading" },
              { key: "subheading", label: "Subheading" }, { key: "button_text", label: "Button Text" },
              { key: "success_heading", label: "Success Heading" }, { key: "success_message", label: "Success Message" },
            ].map(f => (
              <div key={f.key}>
                <Label className="text-white/60 text-xs uppercase tracking-wider">{f.label}</Label>
                <Input value={editing[f.key] || ""} onChange={e => setEditing({ ...editing, [f.key]: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
              </div>
            ))}
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Privacy Text</Label>
              <Textarea value={editing.privacy_text || ""} onChange={e => setEditing({ ...editing, privacy_text: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" rows={2} />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Switch checked={editing.status === "active"} onCheckedChange={v => setEditing({ ...editing, status: v ? "active" : "inactive" })} />
              <Label className="text-white/60">Active</Label>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-white font-medium">Fields ({(editing.fields || []).length})</h3>
            <Button onClick={addField} size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-xl"><Plus className="w-3 h-3 mr-1" /> Add Field</Button>
          </div>

          <div className="space-y-3">
            {(editing.fields || []).map((field, idx) => (
              <div key={idx} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex gap-3 items-start">
                <div className="flex flex-col gap-1 pt-1">
                  <button onClick={() => moveField(idx, -1)} disabled={idx === 0} className="text-white/30 hover:text-white disabled:opacity-20"><ChevronUp className="w-3 h-3" /></button>
                  <button onClick={() => moveField(idx, 1)} disabled={idx === editing.fields.length - 1} className="text-white/30 hover:text-white disabled:opacity-20"><ChevronDown className="w-3 h-3" /></button>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-white/40 text-xs">Name</Label>
                    <Input value={field.name || ""} onChange={e => updateField(idx, "name", e.target.value)} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-sm" />
                  </div>
                  <div>
                    <Label className="text-white/40 text-xs">Label</Label>
                    <Input value={field.label || ""} onChange={e => updateField(idx, "label", e.target.value)} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-sm" />
                  </div>
                  <div>
                    <Label className="text-white/40 text-xs">Type</Label>
                    <select value={field.type || "text"} onChange={e => updateField(idx, "type", e.target.value)} className="mt-1 w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none">
                      {FIELD_TYPES.map(t => <option key={t} value={t} className="bg-stone-900">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-white/40 text-xs">Placeholder</Label>
                    <Input value={field.placeholder || ""} onChange={e => updateField(idx, "placeholder", e.target.value)} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-sm" />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Switch checked={field.required || false} onCheckedChange={v => updateField(idx, "required", v)} />
                    <Label className="text-white/40 text-xs">Required</Label>
                  </div>
                </div>
                <button onClick={() => removeField(idx)} className="text-white/30 hover:text-red-400 mt-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}