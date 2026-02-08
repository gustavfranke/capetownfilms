import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Download, Eye } from "lucide-react";

export default function AdminSurveySubmissions() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const { data: responses } = useQuery({
    queryKey: ["survey-responses-all"],
    queryFn: () => base44.entities.SurveyResponse.list("-created_date"),
    initialData: [],
  });

  const filtered = responses.filter(r => {
    if (!search) return true;
    const name = r.answers?.full_name || "";
    const email = r.answers?.email || "";
    return name.toLowerCase().includes(search.toLowerCase()) || 
           email.toLowerCase().includes(search.toLowerCase());
  });

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "WhatsApp", "Wedding Date", "Wedding Setting", "Guest Count", "Planning Stage", "Vault Interest", "Tags", "Created"];
    const rows = filtered.map(r => [
      r.answers?.full_name || "",
      r.answers?.email || "",
      r.answers?.whatsapp_number || "",
      r.answers?.wedding_date || "",
      r.answers?.wedding_setting || "",
      r.answers?.guest_count || "",
      r.answers?.planning_stage || "",
      r.answers?.vault_interest || "",
      (r.tags || []).join("; "),
      r.created_date
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "survey-submissions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout currentPage="AdminSurvey">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-light text-white">Survey Submissions</h1>
          <p className="text-white/40 text-sm mt-1">{responses.length} total submissions</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="border-white/10 text-white/60 hover:text-white hover:bg-white/5">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
        <Input
          placeholder="Search name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl"
        />
      </div>

      <Card className="bg-white/[0.03] border-white/[0.06]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/30 font-normal py-3 px-4">Name</th>
                  <th className="text-left text-white/30 font-normal py-3 px-4">Email</th>
                  <th className="text-left text-white/30 font-normal py-3 px-4 hidden md:table-cell">Wedding Date</th>
                  <th className="text-left text-white/30 font-normal py-3 px-4 hidden lg:table-cell">Tags</th>
                  <th className="text-left text-white/30 font-normal py-3 px-4">Status</th>
                  <th className="text-left text-white/30 font-normal py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(response => (
                  <tr key={response.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelected(response)}>
                    <td className="py-3 px-4 text-white/80">{response.answers?.full_name || "Anonymous"}</td>
                    <td className="py-3 px-4 text-white/50">{response.answers?.email || "-"}</td>
                    <td className="py-3 px-4 text-white/40 hidden md:table-cell">{response.answers?.wedding_date || "-"}</td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {(response.tags || []).map(tag => (
                          <Badge key={tag} className="bg-amber-500/20 text-amber-400 text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {response.completed ? (
                        <Badge className="bg-green-500/20 text-green-400 text-[10px]">Completed</Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px]">In Progress</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={e => { e.stopPropagation(); setSelected(response); }}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-white/20">No submissions found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-stone-900 border-white/10 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-xl">{selected?.answers?.full_name || "Anonymous"}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <div>
                  <span className="text-white/30 text-xs uppercase tracking-wider block mb-1">Email</span>
                  <span className="text-white/70">{selected.answers?.email || "-"}</span>
                </div>
                <div>
                  <span className="text-white/30 text-xs uppercase tracking-wider block mb-1">WhatsApp</span>
                  <span className="text-white/70">{selected.answers?.whatsapp_number || "-"}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm uppercase tracking-wider">Survey Answers</h3>
                
                {Object.entries(selected.answers || {}).filter(([key]) => !["full_name", "email", "whatsapp_number"].includes(key)).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    <span className="text-white/30 text-xs uppercase tracking-wider block mb-2">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-white/80">
                      {Array.isArray(value) ? value.join(", ") : value || "-"}
                    </span>
                  </div>
                ))}
              </div>

              {selected.tags && selected.tags.length > 0 && (
                <div>
                  <span className="text-white/30 text-xs uppercase tracking-wider block mb-2">Tags</span>
                  <div className="flex gap-2 flex-wrap">
                    {selected.tags.map(tag => (
                      <Badge key={tag} className="bg-amber-500/20 text-amber-400">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-white/30 text-xs">
                Submitted: {new Date(selected.created_date).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}