import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Save, Loader2, Wand2, ArrowLeft, Globe } from "lucide-react";

const STATUS_COLORS = {
  draft: "bg-white/10 text-white/40",
  needs_humanize: "bg-yellow-500/20 text-yellow-400",
  humanized: "bg-blue-500/20 text-blue-400",
  published: "bg-green-500/20 text-green-400",
};

const AUDIENCE_LABELS = {
  local_sa: "Local SA Couples",
  destination_us: "Destination US",
  destination_eu: "Destination EU",
  venue_seo: "Venue SEO",
  general: "General",
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminBlogBuilder() {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [humanizing, setHumanizing] = useState(false);
  const [genModal, setGenModal] = useState(false);
  const [genForm, setGenForm] = useState({ keyword: "", audience: "local_sa", venue: "", tone: "" });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAudience, setFilterAudience] = useState("");
  const [genMessage, setGenMessage] = useState("");
  const qc = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => base44.entities.BlogPost.list("-created_date"),
  });

  const filtered = posts.filter(p =>
    (!filterStatus || p.status === filterStatus) &&
    (!filterAudience || p.target_audience === filterAudience)
  );

  const handleNew = () => {
    setEditing({ title: "", slug: "", body: "", excerpt: "", cover_image_url: "", focus_keyword: "", meta_title: "", meta_description: "", target_audience: "local_sa", venue_tag: "", status: "draft" });
  };

  const handleSave = async () => {
    setSaving(true);
    if (editing.id) {
      const { id, created_date, updated_date, created_by, ...rest } = editing;
      await base44.entities.BlogPost.update(id, rest);
    } else {
      await base44.entities.BlogPost.create({ ...editing });
    }
    qc.invalidateQueries({ queryKey: ["blogPosts"] });
    setSaving(false);
    setEditing(null);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenMessage("");
    try {
      const prompt = `Write a blog post for a Cape Town wedding videographer website. Focus keyword: ${genForm.keyword}. Target audience: ${AUDIENCE_LABELS[genForm.audience]}. ${genForm.venue ? `Venue: ${genForm.venue}.` : ""} ${genForm.tone ? genForm.tone : ""} Include: an engaging title, a 400-600 word post, a meta title (max 60 chars), and a meta description (max 160 chars). Format your response as JSON with keys: title, slug, body, meta_title, meta_description, excerpt.`;
      const res = await base44.functions.invoke("generateBlogPost", { prompt, action: "generate" });
      const data = res.data?.result || res.data;
      setEditing({
        title: data.title || "",
        slug: data.slug || slugify(data.title || genForm.keyword),
        body: data.body || "",
        excerpt: data.excerpt || "",
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        focus_keyword: genForm.keyword,
        target_audience: genForm.audience,
        venue_tag: genForm.venue,
        status: "needs_humanize",
        generated_at: new Date().toISOString(),
      });
      setGenModal(false);
      setGenMessage("Draft generated — ready to humanize");
    } catch (e) {
      setGenMessage("Generation failed: " + e.message);
    }
    setGenerating(false);
  };

  const handleHumanize = async () => {
    if (!editing?.body) return;
    setHumanizing(true);
    try {
      const res = await base44.functions.invoke("generateBlogPost", { body: editing.body, action: "humanize" });
      const humanized = res.data?.result || res.data;
      setEditing({ ...editing, body: humanized, status: "humanized", humanized_at: new Date().toISOString() });
      setGenMessage("Humanized ✓");
    } catch (e) {
      setGenMessage("Humanize failed: " + e.message);
    }
    setHumanizing(false);
  };

  const handlePublish = async () => {
    const updated = { ...editing, status: "published", published_at: new Date().toISOString() };
    setEditing(updated);
    if (updated.id) {
      await base44.entities.BlogPost.update(updated.id, { status: "published", published_at: updated.published_at });
      qc.invalidateQueries({ queryKey: ["blogPosts"] });
    }
  };

  const wordCount = editing?.body ? editing.body.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <AdminLayout currentPage="AdminBlogBuilder">
      {!editing ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-light text-white">Blog Builder</h1>
              <p className="text-white/40 text-sm mt-1">Manage and generate blog content</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setGenModal(true)} className="bg-white/10 hover:bg-white/20 text-white rounded-xl">
                <Wand2 className="w-4 h-4 mr-2" /> Generate with AI
              </Button>
              <Button onClick={handleNew} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> New Post
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-4">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 text-white/70 rounded-xl px-3 py-2 text-sm focus:outline-none">
              <option value="">All Statuses</option>
              {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="bg-stone-900">{s}</option>)}
            </select>
            <select value={filterAudience} onChange={e => setFilterAudience(e.target.value)} className="bg-white/5 border border-white/10 text-white/70 rounded-xl px-3 py-2 text-sm focus:outline-none">
              <option value="">All Audiences</option>
              {Object.entries(AUDIENCE_LABELS).map(([v, l]) => <option key={v} value={v} className="bg-stone-900">{l}</option>)}
            </select>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Title", "Status", "Focus Keyword", "Audience", "Created"].map(h => (
                    <th key={h} className="text-left text-white/40 text-xs uppercase tracking-wider px-4 py-3 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer" onClick={() => setEditing({ ...post })}>
                    <td className="px-4 py-3 text-white text-sm truncate max-w-[200px]">{post.title || "(untitled)"}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[post.status] || STATUS_COLORS.draft}`}>{post.status || "draft"}</span></td>
                    <td className="px-4 py-3 text-white/50 text-sm">{post.focus_keyword || "—"}</td>
                    <td className="px-4 py-3 text-white/50 text-sm">{AUDIENCE_LABELS[post.target_audience] || "—"}</td>
                    <td className="px-4 py-3 text-white/30 text-xs">{new Date(post.created_date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-white/30 text-sm">No posts found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* AI Generate Modal */}
          {genModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-stone-900 border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-medium">Generate with AI</h2>
                  <button onClick={() => setGenModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Focus Keyword *</Label>
                    <Input value={genForm.keyword} onChange={e => setGenForm({ ...genForm, keyword: e.target.value })} placeholder="cape town wedding videographer" className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Target Audience</Label>
                    <select value={genForm.audience} onChange={e => setGenForm({ ...genForm, audience: e.target.value })} className="mt-2 w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 focus:outline-none">
                      {Object.entries(AUDIENCE_LABELS).map(([v, l]) => <option key={v} value={v} className="bg-stone-900">{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Venue (optional)</Label>
                    <Input value={genForm.venue} onChange={e => setGenForm({ ...genForm, venue: e.target.value })} placeholder="Babylonstoren" className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Tone notes (optional)</Label>
                    <Textarea value={genForm.tone} onChange={e => setGenForm({ ...genForm, tone: e.target.value })} placeholder="Keep it personal, mention documentary style…" className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" rows={3} />
                  </div>
                  {genMessage && <p className="text-amber-400 text-sm">{genMessage}</p>}
                  <Button onClick={handleGenerate} disabled={generating || !genForm.keyword} className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                    {generating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating…</> : <><Wand2 className="w-4 h-4 mr-2" />Generate Draft</>}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => { setEditing(null); setGenMessage(""); }} className="text-white/40 hover:text-white text-sm flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to list
            </button>
            <div className="flex gap-2">
              {(editing.status === "needs_humanize" || editing.status === "draft") && (
                <Button onClick={handleHumanize} disabled={humanizing} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  {humanizing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />} Humanize
                </Button>
              )}
              {editing.status !== "published" && (
                <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                  <Globe className="w-4 h-4 mr-2" /> Publish
                </Button>
              )}
              <Button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save
              </Button>
            </div>
          </div>

          {genMessage && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-400 text-sm mb-4">{genMessage}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Title</Label>
              <Input value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Slug</Label>
              <Input value={editing.slug || ""} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Focus Keyword</Label>
              <Input value={editing.focus_keyword || ""} onChange={e => setEditing({ ...editing, focus_keyword: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Target Audience</Label>
              <select value={editing.target_audience || "general"} onChange={e => setEditing({ ...editing, target_audience: e.target.value })} className="mt-2 w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 focus:outline-none">
                {Object.entries(AUDIENCE_LABELS).map(([v, l]) => <option key={v} value={v} className="bg-stone-900">{l}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Meta Title</Label>
              <Input value={editing.meta_title || ""} onChange={e => setEditing({ ...editing, meta_title: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Meta Description</Label>
              <Input value={editing.meta_description || ""} onChange={e => setEditing({ ...editing, meta_description: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Venue Tag</Label>
              <Input value={editing.venue_tag || ""} onChange={e => setEditing({ ...editing, venue_tag: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Status</Label>
              <select value={editing.status || "draft"} onChange={e => setEditing({ ...editing, status: e.target.value })} className="mt-2 w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 focus:outline-none">
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="bg-stone-900">{s}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-white/60 text-xs uppercase tracking-wider">Excerpt</Label>
              <Textarea value={editing.excerpt || ""} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" rows={2} />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Cover Image URL</Label>
              <Input value={editing.cover_image_url || ""} onChange={e => setEditing({ ...editing, cover_image_url: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-white/60 text-xs uppercase tracking-wider">Body (Markdown)</Label>
              <span className="text-white/30 text-xs">{wordCount} words</span>
            </div>
            <Textarea
              value={editing.body || ""}
              onChange={e => setEditing({ ...editing, body: e.target.value })}
              className="bg-white/5 border-white/10 text-white rounded-xl font-mono text-sm"
              rows={20}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}