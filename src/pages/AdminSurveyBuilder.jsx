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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Plus, Pencil, Trash2, Save } from "lucide-react";

const DEFAULT_QUESTIONS = [
  { id: "q1", field_key: "wedding_date", question: "When is your wedding date?", type: "date", required: true, order: 1, options: [] },
  { id: "q2", field_key: "wedding_setting", question: "Which best describes your Cape Town wedding setting?", type: "single_select", required: true, order: 2, options: ["Winelands estate", "Private villa or luxury home", "Beach or ocean view venue", "Luxury hotel", "Botanical garden style venue", "Not chosen yet"] },
  { id: "q3", field_key: "guest_count", question: "How many guests are you expecting?", type: "single_select", required: true, order: 3, options: ["Under 30 (intimate)", "30 to 60", "60 to 120", "120 to 200", "200+"] },
  { id: "q4", field_key: "wedding_style", question: "What style best describes your dream wedding?", type: "single_select", required: true, order: 4, options: ["Elegant and timeless", "Modern luxury", "Romantic and soft", "Editorial fashion inspired", "Natural and earthy", "Not sure yet"] },
  { id: "q5", field_key: "film_vibe", question: "What do you want your wedding film to feel like?", type: "single_select", required: true, order: 5, options: ["Cinematic and emotional", "Luxury and editorial", "Fun and energetic", "Documentary and natural", "A mix of cinematic and documentary"] },
  { id: "q6", field_key: "film_priorities", question: "What matters most to you in your wedding film?", type: "multi_select", required: true, order: 6, options: ["Capturing real emotion", "Cinematic storytelling and pacing", "Beautiful audio of vows and speeches", "A film that feels timeless", "A short teaser for social media", "Full ceremony and speeches included", "Drone shots where possible"] },
  { id: "q7", field_key: "planning_stage", question: "Where are you in planning right now?", type: "single_select", required: true, order: 7, options: ["Just starting", "Venue secured", "Planner secured", "Most vendors booked", "Final details stage"] },
  { id: "q8", field_key: "vault_interest", question: "Do you want access to my Luxury Vendor Vault to simplify planning?", type: "single_select", required: true, order: 8, options: ["Yes, send it to me", "Maybe, tell me more", "I already have my vendor team"] },
  { id: "q9", field_key: "planning_support", question: "What would make planning feel effortless right now?", type: "multi_select", required: true, order: 9, options: ["Finding the perfect venue", "Choosing a planner or coordinator", "Finding premium makeup and hair", "Choosing a photographer that works well with video", "Florals and decor with a luxury aesthetic", "A trusted vendor shortlist", "Building a smooth multi day schedule"], conditional_rules: [{ condition_field: "planning_stage", condition_value: "Most vendors booked", action: "hide" }, { condition_field: "planning_stage", condition_value: "Final details stage", action: "hide" }] },
  { id: "q10", field_key: "contact_details", question: "Where should I send your Vendor Vault and consultation details?", type: "contact_step", required: true, order: 10, options: [] },
  { id: "q11", field_key: "wedding_feel_sentence", question: "In one sentence, what do you want your wedding to feel like?", type: "textarea", required: false, order: 11, options: [], helper_text: "Optional - helps us understand your vision" },
];

export default function AdminSurveyBuilder() {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [newOption, setNewOption] = useState("");
  const qc = useQueryClient();

  const { data: config } = useQuery({
    queryKey: ["survey-config-questions"],
    queryFn: async () => {
      const configs = await base44.entities.SurveyConfig.filter({ config_key: "questions" });
      if (configs.length === 0) {
        // Initialize with default questions
        const newConfig = await base44.entities.SurveyConfig.create({
          config_key: "questions",
          questions: DEFAULT_QUESTIONS
        });
        return newConfig;
      }
      return configs[0];
    },
  });

  const updateMut = useMutation({
    mutationFn: (data) => base44.entities.SurveyConfig.update(config.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["survey-config-questions"] });
      setEditing(null);
    },
  });

  const questions = config?.questions || [];

  const handleSave = () => {
    const updatedQuestions = questions.map(q => 
      q.id === editing.id ? { ...form } : q
    );
    updateMut.mutate({ questions: updatedQuestions });
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this question?")) return;
    const updatedQuestions = questions.filter(q => q.id !== id);
    updateMut.mutate({ questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    const newQ = {
      id: `q${Date.now()}`,
      field_key: `custom_${Date.now()}`,
      question: "New Question",
      type: "text",
      required: true,
      order: questions.length + 1,
      options: []
    };
    updateMut.mutate({ questions: [...questions, newQ] });
  };

  return (
    <AdminLayout currentPage="AdminSurvey">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Survey Builder</h1>
          <p className="text-white/40 text-sm mt-1">Manage survey questions and conditional logic</p>
        </div>
        <Button onClick={handleAddQuestion} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Question
        </Button>
      </div>

      <div className="space-y-4">
        {questions.sort((a, b) => a.order - b.order).map(q => (
          <Card key={q.id} className="bg-white/[0.03] border-white/[0.06]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <GripVertical className="w-4 h-4 text-white/20" />
                <div>
                  <CardTitle className="text-white text-sm font-medium">{q.question}</CardTitle>
                  <p className="text-white/30 text-xs mt-1">
                    {q.field_key} • {q.type} • {q.required ? "Required" : "Optional"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { setForm(q); setEditing(q); }} variant="outline" size="sm" className="border-white/10 text-white/60 hover:text-white">
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button onClick={() => handleDelete(q.id)} variant="outline" size="sm" className="border-white/10 text-red-400 hover:text-red-300">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="bg-stone-900 border-white/10 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-light">Edit Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div>
              <Label className="text-white/60 text-xs">Question Text</Label>
              <Textarea
                value={form.question || ""}
                onChange={e => setForm({ ...form, question: e.target.value })}
                className="mt-2 bg-white/5 border-white/10 text-white rounded-xl"
              />
            </div>
            <div>
              <Label className="text-white/60 text-xs">Helper Text</Label>
              <Input
                value={form.helper_text || ""}
                onChange={e => setForm({ ...form, helper_text: e.target.value })}
                className="mt-2 bg-white/5 border-white/10 text-white rounded-xl"
              />
            </div>
            <div>
              <Label className="text-white/60 text-xs">Field Key</Label>
              <Input
                value={form.field_key || ""}
                onChange={e => setForm({ ...form, field_key: e.target.value })}
                className="mt-2 bg-white/5 border-white/10 text-white rounded-xl"
              />
            </div>
            <div>
              <Label className="text-white/60 text-xs">Type</Label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="single_select">Single Select</SelectItem>
                  <SelectItem value="multi_select">Multi Select</SelectItem>
                  <SelectItem value="contact_step">Contact Step</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(form.type === "single_select" || form.type === "multi_select") && (
              <div>
                <Label className="text-white/60 text-xs">Options</Label>
                <div className="mt-2 space-y-2">
                  {(form.options || []).map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={opt} onChange={e => {
                        const updated = [...(form.options || [])];
                        updated[i] = e.target.value;
                        setForm({ ...form, options: updated });
                      }} className="bg-white/5 border-white/10 text-white rounded-xl" />
                      <Button onClick={() => {
                        setForm({ ...form, options: (form.options || []).filter((_, idx) => idx !== i) });
                      }} variant="outline" size="sm" className="border-white/10 text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="New option..."
                      value={newOption}
                      onChange={e => setNewOption(e.target.value)}
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                    />
                    <Button onClick={() => {
                      if (newOption.trim()) {
                        setForm({ ...form, options: [...(form.options || []), newOption.trim()] });
                        setNewOption("");
                      }
                    }} variant="outline" className="border-white/10 text-white">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Label className="text-white/60 text-xs">Required</Label>
              <Switch checked={form.required} onCheckedChange={v => setForm({ ...form, required: v })} />
            </div>
            <Button onClick={handleSave} disabled={updateMut.isPending} className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-5">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}