import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Loader2, X } from "lucide-react";

const STATUS_COLORS = {
  draft: "bg-white/10 text-white/40",
  needs_humanize: "bg-yellow-500/20 text-yellow-400",
  humanized: "bg-blue-500/20 text-blue-400",
  published: "bg-green-500/20 text-green-400",
};

function seoHealth(post) {
  const mtOk = post.meta_title && post.meta_title.length >= 30 && post.meta_title.length <= 60;
  const mdOk = post.meta_description && post.meta_description.length >= 120 && post.meta_description.length <= 160;
  const kwOk = !!post.focus_keyword;
  if (mtOk && mdOk && kwOk) return "green";
  if (mtOk || mdOk || kwOk) return "yellow";
  return "red";
}

const HEALTH_STYLES = {
  green: "bg-green-500/20 text-green-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  red: "bg-red-500/20 text-red-400",
};

export default function AdminSEOManager() {
  const [siteForm, setSiteForm] = useState({});
  const [savingSite, setSavingSite] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [savingPost, setSavingPost] = useState(false);
  const qc = useQueryClient();

  const { data: settingsArr = [] } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => base44.entities.BlogPost.list("-created_date"),
  });

  const settings = settingsArr[0];

  useEffect(() => {
    if (settings) setSiteForm({ seo_title: settings.seo_title || "", seo_description: settings.seo_description || "", og_image_url: settings.og_image_url || "" });
  }, [settings]);

  const saveSiteSettings = async () => {
    if (!settings) return;
    setSavingSite(true);
    await base44.entities.SiteSettings.update(settings.id, siteForm);
    qc.invalidateQueries({ queryKey: ["admin-settings"] });
    setSavingSite(false);
  };

  const savePost = async () => {
    setSavingPost(true);
    const { id, created_date, updated_date, created_by, ...rest } = editingPost;
    await base44.entities.BlogPost.update(id, rest);
    qc.invalidateQueries({ queryKey: ["blogPosts"] });
    setSavingPost(false);
    setEditingPost(null);
  };

  return (
    <AdminLayout currentPage="AdminSEOManager">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-white">SEO Manager</h1>
        <p className="text-white/40 text-sm mt-1">Global SEO settings and blog post meta</p>
      </div>

      {/* Site-wide SEO */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-medium">Site SEO</h2>
          <Button onClick={saveSiteSettings} disabled={savingSite} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
            {savingSite ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />} Save
          </Button>
        </div>
        <div className="grid gap-4">
          <div>
            <div className="flex justify-between">
              <Label className="text-white/60 text-xs uppercase tracking-wider">SEO Title</Label>
              <span className={`text-xs ${siteForm.seo_title?.length > 60 ? "text-red-400" : "text-white/30"}`}>{siteForm.seo_title?.length || 0}/60</span>
            </div>
            <Input value={siteForm.seo_title || ""} onChange={e => setSiteForm({ ...siteForm, seo_title: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            {siteForm.seo_title?.length > 60 && <p className="text-red-400 text-xs mt-1">Title is too long (max 60 chars)</p>}
          </div>
          <div>
            <div className="flex justify-between">
              <Label className="text-white/60 text-xs uppercase tracking-wider">Meta Description</Label>
              <span className={`text-xs ${siteForm.seo_description?.length > 160 ? "text-red-400" : "text-white/30"}`}>{siteForm.seo_description?.length || 0}/160</span>
            </div>
            <Textarea value={siteForm.seo_description || ""} onChange={e => setSiteForm({ ...siteForm, seo_description: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" rows={3} />
            {siteForm.seo_description?.length > 160 && <p className="text-red-400 text-xs mt-1">Description is too long (max 160 chars)</p>}
          </div>
          <div>
            <Label className="text-white/60 text-xs uppercase tracking-wider">OG Image URL</Label>
            <Input value={siteForm.og_image_url || ""} onChange={e => setSiteForm({ ...siteForm, og_image_url: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            {siteForm.og_image_url && <img src={siteForm.og_image_url} alt="OG preview" className="mt-2 h-20 rounded-lg object-cover" />}
          </div>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Title", "Focus Keyword", "Meta Title", "Status", "Health", "Published", ""].map(h => (
                <th key={h} className="text-left text-white/40 text-xs uppercase tracking-wider px-4 py-3 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map(post => {
              const health = seoHealth(post);
              return (
                <tr key={post.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer" onClick={() => setEditingPost({ ...post })}>
                  <td className="px-4 py-3 text-white text-sm truncate max-w-[160px]">{post.title}</td>
                  <td className="px-4 py-3 text-white/50 text-sm">{post.focus_keyword || "—"}</td>
                  <td className="px-4 py-3 text-white/50 text-sm truncate max-w-[140px]">{post.meta_title || "—"}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[post.status] || STATUS_COLORS.draft}`}>{post.status || "draft"}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${HEALTH_STYLES[health]}`}>{health}</span></td>
                  <td className="px-4 py-3 text-white/30 text-xs">{post.published_at ? new Date(post.published_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3"><button className="text-white/30 hover:text-white text-xs">Edit</button></td>
                </tr>
              );
            })}
            {posts.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-white/30 text-sm">No blog posts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side panel for editing post SEO */}
      {editingPost && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-stone-900 border-l border-white/10 z-50 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-medium">Edit SEO</h2>
            <button onClick={() => setEditingPost(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <p className="text-white/40 text-sm mb-6 truncate">{editingPost.title}</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between">
                <Label className="text-white/60 text-xs uppercase tracking-wider">Meta Title</Label>
                <span className={`text-xs ${editingPost.meta_title?.length > 60 ? "text-red-400" : "text-white/30"}`}>{editingPost.meta_title?.length || 0}/60</span>
              </div>
              <Input value={editingPost.meta_title || ""} onChange={e => setEditingPost({ ...editingPost, meta_title: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <div className="flex justify-between">
                <Label className="text-white/60 text-xs uppercase tracking-wider">Meta Description</Label>
                <span className={`text-xs ${editingPost.meta_description?.length > 160 ? "text-red-400" : "text-white/30"}`}>{editingPost.meta_description?.length || 0}/160</span>
              </div>
              <Textarea value={editingPost.meta_description || ""} onChange={e => setEditingPost({ ...editingPost, meta_description: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" rows={3} />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Focus Keyword</Label>
              <Input value={editingPost.focus_keyword || ""} onChange={e => setEditingPost({ ...editingPost, focus_keyword: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Slug</Label>
              <Input value={editingPost.slug || ""} onChange={e => setEditingPost({ ...editingPost, slug: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Target Audience</Label>
              <select value={editingPost.target_audience || ""} onChange={e => setEditingPost({ ...editingPost, target_audience: e.target.value })} className="mt-2 w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 focus:outline-none">
                <option value="" className="bg-stone-900">— Select —</option>
                <option value="local_sa" className="bg-stone-900">Local SA Couples</option>
                <option value="destination_us" className="bg-stone-900">Destination US</option>
                <option value="destination_eu" className="bg-stone-900">Destination EU</option>
                <option value="venue_seo" className="bg-stone-900">Venue SEO</option>
                <option value="general" className="bg-stone-900">General</option>
              </select>
            </div>
          </div>
          <Button onClick={savePost} disabled={savingPost} className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
            {savingPost ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save SEO
          </Button>
        </div>
      )}
    </AdminLayout>
  );
}