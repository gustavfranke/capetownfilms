import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Copy, Eye, Archive, X, ChevronUp, ChevronDown, Trash2, Save, Loader2 } from "lucide-react";

const STATUS_COLORS = { live: "bg-green-500/20 text-green-400", draft: "bg-yellow-500/20 text-yellow-400", archived: "bg-white/10 text-white/40" };

export default function AdminQuizBuilder() {
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const { data: quizzes = [] } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => base44.entities.Quiz.list("-created_date"),
  });

  const { data: contactForms = [] } = useQuery({
    queryKey: ["contactForms"],
    queryFn: () => base44.entities.ContactForm.list(),
  });

  const handleNew = async () => {
    const q = await base44.entities.Quiz.create({ title: "New Quiz", slug: "/quiz/new", status: "draft", questions: [], show_progress_bar: true });
    qc.invalidateQueries({ queryKey: ["quizzes"] });
    setEditingQuiz({ ...q });
  };

  const handleCopy = async (quiz) => {
    const { id, created_date, updated_date, created_by, ...rest } = quiz;
    await base44.entities.Quiz.create({ ...rest, title: `(Copy of ${quiz.title})`, status: "draft" });
    qc.invalidateQueries({ queryKey: ["quizzes"] });
  };

  const handleArchive = async (quiz) => {
    await base44.entities.Quiz.update(quiz.id, { status: "archived" });
    qc.invalidateQueries({ queryKey: ["quizzes"] });
  };

  const handleSave = async () => {
    setSaving(true);
    const { id, created_date, updated_date, created_by, ...rest } = editingQuiz;
    await base44.entities.Quiz.update(id, rest);
    qc.invalidateQueries({ queryKey: ["quizzes"] });
    setSaving(false);
  };

  const addQuestion = () => {
    const q = { id: Date.now().toString(), question: "", type: "single_select", options: [], helper_text: "", order: editingQuiz.questions.length, required: true };
    setEditingQuiz({ ...editingQuiz, questions: [...(editingQuiz.questions || []), q] });
  };

  const updateQuestion = (idx, field, value) => {
    const qs = [...editingQuiz.questions];
    qs[idx] = { ...qs[idx], [field]: value };
    setEditingQuiz({ ...editingQuiz, questions: qs });
  };

  const removeQuestion = (idx) => {
    const qs = editingQuiz.questions.filter((_, i) => i !== idx);
    setEditingQuiz({ ...editingQuiz, questions: qs });
  };

  const moveQuestion = (idx, dir) => {
    const qs = [...editingQuiz.questions];
    const swap = idx + dir;
    if (swap < 0 || swap >= qs.length) return;
    [qs[idx], qs[swap]] = [qs[swap], qs[idx]];
    setEditingQuiz({ ...editingQuiz, questions: qs });
  };

  const addOption = (qIdx) => {
    const qs = [...editingQuiz.questions];
    qs[qIdx] = { ...qs[qIdx], options: [...(qs[qIdx].options || []), { label: "", value: "", emoji: "" }] };
    setEditingQuiz({ ...editingQuiz, questions: qs });
  };

  const updateOption = (qIdx, oIdx, field, value) => {
    const qs = [...editingQuiz.questions];
    const opts = [...(qs[qIdx].options || [])];
    opts[oIdx] = { ...opts[oIdx], [field]: value };
    qs[qIdx] = { ...qs[qIdx], options: opts };
    setEditingQuiz({ ...editingQuiz, questions: qs });
  };

  const removeOption = (qIdx, oIdx) => {
    const qs = [...editingQuiz.questions];
    qs[qIdx] = { ...qs[qIdx], options: qs[qIdx].options.filter((_, i) => i !== oIdx) };
    setEditingQuiz({ ...editingQuiz, questions: qs });
  };

  return (
    <AdminLayout currentPage="AdminQuizBuilder">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Quiz Builder</h1>
          <p className="text-white/40 text-sm mt-1">Create and manage interactive quizzes</p>
        </div>
        <Button onClick={handleNew} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> New Quiz
        </Button>
      </div>

      {/* Quiz List */}
      {!editingQuiz && (
        <div className="grid gap-4">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{quiz.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <a href={quiz.slug} target="_blank" rel="noreferrer" className="text-amber-400 text-xs hover:underline">{quiz.slug}</a>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[quiz.status] || STATUS_COLORS.draft}`}>{quiz.status}</span>
                  <span className="text-white/30 text-xs">{quiz.total_responses || 0} responses</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white" onClick={() => setEditingQuiz({ ...quiz })}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white" onClick={() => handleCopy(quiz)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white" onClick={() => window.open(window.location.origin + quiz.slug, "_blank")}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white" onClick={() => handleArchive(quiz)}>
                  <Archive className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {quizzes.length === 0 && (
            <div className="text-center py-16 text-white/30">No quizzes yet. Create your first one.</div>
          )}
        </div>
      )}

      {/* Edit Panel */}
      {editingQuiz && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setEditingQuiz(null)} className="text-white/40 hover:text-white text-sm flex items-center gap-2">
              <X className="w-4 h-4" /> Close
            </button>
            <Button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Title</Label>
              <Input value={editingQuiz.title || ""} onChange={e => setEditingQuiz({ ...editingQuiz, title: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Slug</Label>
              <Input value={editingQuiz.slug || ""} onChange={e => setEditingQuiz({ ...editingQuiz, slug: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
              {editingQuiz.slug && !editingQuiz.slug.startsWith("/quiz/") && (
                <p className="text-red-400 text-xs mt-1">Slug must start with /quiz/</p>
              )}
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Status</Label>
              <select value={editingQuiz.status || "draft"} onChange={e => setEditingQuiz({ ...editingQuiz, status: e.target.value })} className="mt-2 w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 focus:outline-none">
                <option value="draft" className="bg-stone-900">Draft</option>
                <option value="live" className="bg-stone-900">Live</option>
                <option value="archived" className="bg-stone-900">Archived</option>
              </select>
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Optin Form</Label>
              <select value={editingQuiz.optin_form_id || ""} onChange={e => setEditingQuiz({ ...editingQuiz, optin_form_id: e.target.value })} className="mt-2 w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 focus:outline-none">
                <option value="" className="bg-stone-900">None</option>
                {contactForms.map(f => <option key={f.id} value={f.id} className="bg-stone-900">{f.title}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Completion Headline</Label>
              <Input value={editingQuiz.completion_headline || ""} onChange={e => setEditingQuiz({ ...editingQuiz, completion_headline: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Completion Subtext</Label>
              <Input value={editingQuiz.completion_subtext || ""} onChange={e => setEditingQuiz({ ...editingQuiz, completion_subtext: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Notes</Label>
              <Textarea value={editingQuiz.notes || ""} onChange={e => setEditingQuiz({ ...editingQuiz, notes: e.target.value })} className="mt-2 bg-white/5 border-white/10 text-white rounded-xl" rows={2} />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Switch checked={editingQuiz.show_progress_bar || false} onCheckedChange={v => setEditingQuiz({ ...editingQuiz, show_progress_bar: v })} />
              <Label className="text-white/60 text-sm">Show Progress Bar</Label>
            </div>
          </div>

          {/* Questions */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-white font-medium">Questions ({(editingQuiz.questions || []).length})</h3>
            <Button onClick={addQuestion} size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-xl">
              <Plus className="w-3 h-3 mr-1" /> Add Question
            </Button>
          </div>

          <div className="space-y-4">
            {(editingQuiz.questions || []).map((q, qIdx) => (
              <QuestionEditor
                key={q.id || qIdx}
                question={q}
                index={qIdx}
                total={(editingQuiz.questions || []).length}
                onUpdate={(field, val) => updateQuestion(qIdx, field, val)}
                onRemove={() => removeQuestion(qIdx)}
                onMove={(dir) => moveQuestion(qIdx, dir)}
                onAddOption={() => addOption(qIdx)}
                onUpdateOption={(oIdx, field, val) => updateOption(qIdx, oIdx, field, val)}
                onRemoveOption={(oIdx) => removeOption(qIdx, oIdx)}
              />
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function QuestionEditor({ question, index, total, onUpdate, onRemove, onMove, onAddOption, onUpdateOption, onRemoveOption }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex flex-col gap-1">
          <button onClick={e => { e.stopPropagation(); onMove(-1); }} disabled={index === 0} className="text-white/30 hover:text-white disabled:opacity-20"><ChevronUp className="w-3 h-3" /></button>
          <button onClick={e => { e.stopPropagation(); onMove(1); }} disabled={index === total - 1} className="text-white/30 hover:text-white disabled:opacity-20"><ChevronDown className="w-3 h-3" /></button>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm truncate">{question.question || "(no text)"}</p>
          <p className="text-white/30 text-xs">{question.type}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); onRemove(); }} className="text-white/30 hover:text-red-400 p-1"><Trash2 className="w-3 h-3" /></button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06] pt-4">
          <div>
            <Label className="text-white/50 text-xs">Question Text</Label>
            <Input value={question.question || ""} onChange={e => onUpdate("question", e.target.value)} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white/50 text-xs">Type</Label>
              <select value={question.type || "single_select"} onChange={e => onUpdate("type", e.target.value)} className="mt-1 w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none">
                <option value="single_select" className="bg-stone-900">Single Select</option>
                <option value="multi_select" className="bg-stone-900">Multi Select</option>
                <option value="contact_step" className="bg-stone-900">Contact Step</option>
              </select>
            </div>
            <div>
              <Label className="text-white/50 text-xs">Helper Text</Label>
              <Input value={question.helper_text || ""} onChange={e => onUpdate("helper_text", e.target.value)} className="mt-1 bg-white/5 border-white/10 text-white rounded-xl text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={question.required || false} onCheckedChange={v => onUpdate("required", v)} />
            <Label className="text-white/50 text-xs">Required</Label>
          </div>

          {question.type !== "contact_step" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-white/50 text-xs">Options</Label>
                <button onClick={onAddOption} className="text-amber-400 text-xs hover:text-amber-300">+ Add Option</button>
              </div>
              <div className="space-y-2">
                {(question.options || []).map((opt, oIdx) => (
                  <div key={oIdx} className="flex gap-2 items-center">
                    <Input value={opt.emoji || ""} onChange={e => onUpdateOption(oIdx, "emoji", e.target.value)} placeholder="🎉" className="w-16 bg-white/5 border-white/10 text-white rounded-xl text-sm" />
                    <Input value={opt.label || ""} onChange={e => onUpdateOption(oIdx, "label", e.target.value)} placeholder="Label" className="flex-1 bg-white/5 border-white/10 text-white rounded-xl text-sm" />
                    <Input value={opt.value || ""} onChange={e => onUpdateOption(oIdx, "value", e.target.value)} placeholder="value" className="flex-1 bg-white/5 border-white/10 text-white rounded-xl text-sm" />
                    <button onClick={() => onRemoveOption(oIdx)} className="text-white/30 hover:text-red-400"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}