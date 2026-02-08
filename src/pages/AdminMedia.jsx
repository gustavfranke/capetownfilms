import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Trash2, Image, Film, Loader2 } from "lucide-react";

export default function AdminMedia() {
  const [uploading, setUploading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newAsset, setNewAsset] = useState({ title: "", type: "image", category: "general" });
  const qc = useQueryClient();

  const { data: assets } = useQuery({
    queryKey: ["admin-media"],
    queryFn: () => base44.entities.MediaAsset.list("-created_date"),
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: (data) => base44.entities.MediaAsset.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-media"] }); setShowAdd(false); setNewAsset({ title: "", type: "image", category: "general" }); },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.MediaAsset.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-media"] }),
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setNewAsset({ ...newAsset, file_url, title: newAsset.title || file.name });
    setUploading(false);
  };

  const handleSave = () => {
    if (!newAsset.file_url || !newAsset.title) return;
    createMut.mutate(newAsset);
  };

  return (
    <AdminLayout currentPage="AdminMedia">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Media Library</h1>
          <p className="text-white/40 text-sm mt-1">{assets.length} assets</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
          <Upload className="w-4 h-4 mr-2" /> Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {assets.map(asset => (
          <Card key={asset.id} className="bg-white/[0.03] border-white/[0.06] overflow-hidden group">
            <div className="aspect-video relative bg-stone-800">
              {asset.type === "image" ? (
                <img src={asset.file_url} alt={asset.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-8 h-8 text-white/20" />
                </div>
              )}
              <button
                onClick={() => deleteMut.mutate(asset.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <CardContent className="p-3">
              <p className="text-white/70 text-xs truncate">{asset.title}</p>
              <p className="text-white/30 text-[10px] mt-0.5">{asset.category}</p>
            </CardContent>
          </Card>
        ))}
        {assets.length === 0 && (
          <div className="col-span-full text-center py-20 text-white/20">No media uploaded yet</div>
        )}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-stone-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white font-light">Upload Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-white/60 text-xs">Title</Label>
              <Input value={newAsset.title} onChange={e => setNewAsset({ ...newAsset, title: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs">Type</Label>
                <Select value={newAsset.type} onValueChange={v => setNewAsset({ ...newAsset, type: v })}>
                  <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs">Category</Label>
                <Select value={newAsset.category} onValueChange={v => setNewAsset({ ...newAsset, category: v })}>
                  <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="section">Section</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs">File</Label>
              <div className="mt-2 border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" id="media-upload" />
                <label htmlFor="media-upload" className="cursor-pointer">
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" /> : (
                    <>
                      <Image className="w-6 h-6 text-white/20 mx-auto mb-2" />
                      <span className="text-white/30 text-sm">{newAsset.file_url ? "File uploaded ✓" : "Click to upload"}</span>
                    </>
                  )}
                </label>
              </div>
            </div>
            <Button onClick={handleSave} disabled={!newAsset.file_url || !newAsset.title} className="w-full bg-amber-600 hover:bg-amber-700 rounded-xl py-5">
              Save Asset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}