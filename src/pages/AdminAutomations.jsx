import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Mail, MessageSquare, Zap, AlertCircle } from "lucide-react";

export default function AdminAutomations() {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", trigger: "new_lead", type: "email", variant_filter: "all", steps: [] });
  const qc = useQueryClient();

  const { data: automations } = useQuery({
    queryKey: ["admin-automations"],
    queryFn: () => base44.entities.AutomationSequence.list(),
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: d => base44.entities.AutomationSequence.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-automations"] }); setEditing(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AutomationSequence.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-automations"] }); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: id => base44.entities.AutomationSequence.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-automations"] }),
  });

  const openNew = () => {
    setForm({ name: "", trigger: "new_lead", type: "email", variant_filter: "all", status: "integration_pending", steps: [{ step_number: 1, subject: "", body: "", delay_hours: 0 }] });
    setEditing("new");
  };

  const openEdit = a => { setForm({ ...a, steps: a.steps || [] }); setEditing(a); };

  const addStep = () => {
    setForm({ ...form, steps: [...form.steps, { step_number: form.steps.length + 1, subject: "", body: "", delay_hours: 24 }] });
  };

  const updateStep = (i, field, value) => {
    const s = [...form.steps];
    s[i] = { ...s[i], [field]: value };
    setForm({ ...form, steps: s });
  };

  const removeStep = (i) => {
    setForm({ ...form, steps: form.steps.filter((_, idx) => idx !== i) });
  };

  const handleSave = () => {
    if (editing === "new") createMut.mutate(form);
    else { const { id, created_date, updated_date, created_by, ...rest } = form; updateMut.mutate({ id: editing.id, data: rest }); }
  };

  const statusColors = { draft: "bg-gray-500/20 text-gray-400", active: "bg-green-500/20 text-green-400", paused: "bg-yellow-500/20 text-yellow-400", integration_pending: "bg-orange-500/20 text-orange-400" };

  return (
    <AdminLayout currentPage="AdminAutomations">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Automations</h1>
          <p className="text-white/40 text-sm mt-1">Email & WhatsApp sequences</p>
        </div>
        <Button onClick={openNew} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> New Sequence
        </Button>
      </div>

      <Card className="bg-amber-500/5 border-amber-500/20 mb-6">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-amber-400/80 text-sm">Automation sending is pending integration setup. Templates are saved and ready to activate once email/WhatsApp providers are connected.</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {automations.map(a => (
          <Card key={a.id} className="bg-white/[0.03] border-white/[0.06]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {a.type === "email" ? <Mail className="w-4 h-4 text-blue-400" /> : <MessageSquare className="w-4 h-4 text-green-400" />}
                  <div>
                    <h3 className="text-white text-sm font-medium">{a.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge className="bg-white/5 text-white/40 text-[10px]">Trigger: {a.trigger?.replace(/_/g, " ")}</Badge>
                      <Badge className={`${statusColors[a.status] || statusColors.integration_pending} text-[10px]`}>{(a.status || "pending").replace(/_/g, " ")}</Badge>
                      <Badge className="bg-white/5 text-white/40 text-[10px]">{a.steps?.length || 0} steps</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteMut.mutate(a.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {automations.length === 0 && (
          <div className="text-center py-16 text-white/20">No automations created yet</div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="bg-stone-900 border-white/10 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-light">{editing === "new" ? "New Automation" : "Edit Automation"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div>
              <Label className="text-white/60 text-xs">Sequence Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-white/60 text-xs">Trigger</Label>
                <Select value={form.trigger} onValueChange={v => setForm({ ...form, trigger: v })}>
                  <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_lead">New Lead</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs">Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs">Variant Filter</Label>
                <Select value={form.variant_filter} onValueChange={v => setForm({ ...form, variant_filter: v })}>
                  <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="variant-a">Variant A</SelectItem>
                    <SelectItem value="variant-b">Variant B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-white/60 text-xs">Sequence Steps</Label>
                <Button onClick={addStep} size="sm" variant="outline" className="border-white/10 text-white/40 hover:text-white text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Add Step
                </Button>
              </div>
              <div className="space-y-4">
                {form.steps?.map((step, i) => (
                  <Card key={i} className="bg-white/[0.02] border-white/[0.05]">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 text-xs font-medium">Step {i + 1}</span>
                        <button onClick={() => removeStep(i)} className="text-white/20 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {form.type === "email" && (
                          <div className="col-span-2">
                            <Label className="text-white/40 text-xs">Subject</Label>
                            <Input value={step.subject} onChange={e => updateStep(i, "subject", e.target.value)} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-sm" />
                          </div>
                        )}
                        <div className="col-span-2">
                          <Label className="text-white/40 text-xs">Body</Label>
                          <Textarea value={step.body} onChange={e => updateStep(i, "body", e.target.value)} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-sm min-h-[60px]" />
                        </div>
                        <div>
                          <Label className="text-white/40 text-xs">Delay (hours after previous)</Label>
                          <Input type="number" min={0} value={step.delay_hours} onChange={e => updateStep(i, "delay_hours", parseInt(e.target.value))} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-sm" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full bg-amber-600 hover:bg-amber-700 rounded-xl py-5">Save Automation</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}