import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminFAQs() {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ question: "", answer: "", variant: "all", sort_order: 0 });
  const qc = useQueryClient();

  const { data: faqs } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: () => base44.entities.FAQ.list("sort_order"),
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: d => base44.entities.FAQ.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-faqs"] }); setEditing(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FAQ.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-faqs"] }); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: id => base44.entities.FAQ.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-faqs"] }),
  });

  const openNew = () => { setForm({ question: "", answer: "", variant: "all", sort_order: faqs.length }); setEditing("new"); };
  const openEdit = f => { setForm({ ...f }); setEditing(f); };

  const handleSave = () => {
    if (editing === "new") createMut.mutate(form);
    else { const { id, created_date, updated_date, created_by, ...rest } = form; updateMut.mutate({ id: editing.id, data: rest }); }
  };

  return (
    <AdminLayout currentPage="AdminFAQs">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">FAQs</h1>
          <p className="text-white/40 text-sm mt-1">{faqs.length} questions</p>
        </div>
        <Button onClick={openNew} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </Button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <Card key={faq.id} className="bg-white/[0.03] border-white/[0.06]">
            <CardContent className="p-5 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/20 text-xs">#{i + 1}</span>
                  <h3 className="text-white text-sm font-medium">{faq.question}</h3>
                </div>
                <p className="text-white/40 text-sm font-light line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex gap-1 ml-4 shrink-0">
                <button onClick={() => openEdit(faq)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteMut.mutate(faq.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="bg-stone-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white font-light">{editing === "new" ? "Add FAQ" : "Edit FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-white/60 text-xs">Question</Label>
              <Input value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs">Answer</Label>
              <Textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl min-h-[100px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs">Variant</Label>
                <Select value={form.variant} onValueChange={v => setForm({ ...form, variant: v })}>
                  <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="variant-a">Variant A</SelectItem>
                    <SelectItem value="variant-b">Variant B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs">Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) })} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl" />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full bg-amber-600 hover:bg-amber-700 rounded-xl py-5">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}