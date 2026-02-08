import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BarChart3, Users, TrendingUp, AlertCircle, Settings, List, Zap, Target, FileText } from "lucide-react";

export default function AdminSurvey() {
  const { data: responses } = useQuery({
    queryKey: ["survey-responses"],
    queryFn: () => base44.entities.SurveyResponse.list("-created_date"),
    initialData: [],
  });

  const { data: analytics } = useQuery({
    queryKey: ["survey-analytics"],
    queryFn: () => base44.entities.AnalyticsEvent.filter({ 
      event_type: ["survey_opened", "survey_step_completed", "survey_completed"].join(",")
    }),
    initialData: [],
  });

  const completedCount = responses.filter(r => r.completed).length;
  const openedCount = analytics.filter(e => e.event_type === "survey_opened").length;
  const completionRate = openedCount > 0 ? ((completedCount / openedCount) * 100).toFixed(1) : 0;

  // Calculate drop-off by step
  const stepCompletions = {};
  analytics.filter(e => e.event_type === "survey_step_completed").forEach(e => {
    const step = e.metadata?.step || 0;
    stepCompletions[step] = (stepCompletions[step] || 0) + 1;
  });
  
  const topDropOffStep = Object.entries(stepCompletions)
    .sort((a, b) => a[1] - b[1])[0]?.[0] || "N/A";

  const navItems = [
    { title: "Survey Builder", desc: "Manage questions and logic", icon: List, page: "AdminSurveyBuilder" },
    { title: "Triggers", desc: "Configure when survey appears", icon: Zap, page: "AdminSurveyTriggers" },
    { title: "Destinations", desc: "Confirmation screen settings", icon: Target, page: "AdminSurveyDestinations" },
    { title: "Rules & Tags", desc: "Auto-tagging and routing", icon: Settings, page: "AdminSurveyRules" },
    { title: "Submissions", desc: "View all survey responses", icon: FileText, page: "AdminSurveySubmissions" },
  ];

  return (
    <AdminLayout currentPage="AdminSurvey">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-white">Survey Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Manage your multi-step lead qualification survey</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/50 text-xs uppercase tracking-wider font-normal flex items-center gap-2">
              <Users className="w-4 h-4" /> Survey Opens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-white">{openedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/50 text-xs uppercase tracking-wider font-normal flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-white">{completedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/50 text-xs uppercase tracking-wider font-normal flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-white">{completionRate}%</div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/50 text-xs uppercase tracking-wider font-normal flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Top Drop-off
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-white">Step {topDropOffStep}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navItems.map(item => (
          <Link key={item.page} to={createPageUrl(item.page)}>
            <Card className="bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                    <item.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base font-medium mb-1">{item.title}</CardTitle>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 bg-white/[0.03] border-white/[0.06]">
        <CardHeader>
          <CardTitle className="text-white text-base font-medium">Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {responses.slice(0, 5).length > 0 ? (
            <div className="space-y-3">
              {responses.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                  <div>
                    <div className="text-white/80 text-sm">{r.answers?.full_name || "Anonymous"}</div>
                    <div className="text-white/30 text-xs">{new Date(r.created_date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2">
                    {r.completed && (
                      <span className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">Completed</span>
                    )}
                    {r.tags?.map(tag => (
                      <span key={tag} className="text-amber-400 text-xs bg-amber-500/10 px-2 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-center py-8">No submissions yet</p>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}