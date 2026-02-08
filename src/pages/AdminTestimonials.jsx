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
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";

export default function AdminTestimonials() {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", quote: "", rating: 5, variant: "all", is_featured: false, photo_url: "" });
  const qc = useQueryClient();

  const { data: testimonials } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: () => base44.entities.Testimonial.list(),
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: d => base44.entities.Testimonial.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); setEditing(null); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Testimonial.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); setEditing(null); },
  });

  const deleteMut = useMutation({
    mutationFn: id => base44.entities.Testimonial.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  const openNew = () => { setForm({ name: "", role: "", quote: "", rating: 5, variant: "all", is_featured: false, photo_url: "" }); setEditing("new"); };
  const openEdit = t => { setForm({ ...t }); setEditing(t); };

  const handleSave = () => {
    if (editing === "new") { createMut.mutate(form); }
    else { const { id, created_date, updated_date, created_by, ...rest } = form; updateMut.mutate({ id: editing.id, data: rest }); }
  };

  return (
    <AdminLayout currentPage="AdminTestimonials">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Testimonials</h1>
          <p className="text-white/40 text-sm mt-1">{testimonials.length} testimonials</p>
        </div>
        <Button onClick={openNew} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add New
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map(t => (
          <Card key={t.id} className="bg-white/[0.03] border-white/[0.06]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {t.photo_url && <img src={t.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />}
                  <div>
                    <div className="text-white text-sm font-medium">{t.name}</div>
                    <div className="text-white/30 text-xs">{t.role}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteMut.mutate(t.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-white/50 text-sm font-light">"{t.quote}"</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="bg-stone-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white font-light">{editing === "new" ? "Add Testimonial" : "Edit Testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs">Name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl" />
              </div>
              <div>
                <Label className="text-white/60 text-xs">Role</Label>
                <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl" />
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs">Quote</Label>
              <Textarea value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs">Rating (1-5)</Label>
                <Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl" />
              </div>
              <div>
                <Label className="text-white/60 text-xs">Variant</Label>
                <Select value={form.variant} onValueChange={v => setForm({ ...form, variant: v })}>
                  <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Variants</SelectItem>
                    <SelectItem value="variant-a">Variant A</SelectItem>
                    <SelectItem value="variant-b">Variant B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs">Photo URL</Label>
              <Input value={form.photo_url} onChange={e => setForm({ ...form, photo_url: e.target.value })} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured} onCheckedChange={v => setForm({ ...form, is_featured: v })} />
              <Label className="text-white/60 text-sm">Featured</Label>
            </div>
            <Button onClick={handleSave} className="w-full bg-amber-600 hover:bg-amber-700 rounded-xl py-5">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}