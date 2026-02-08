import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, MousePointer, TrendingUp, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: leads } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => base44.entities.Lead.list("-created_date"),
    initialData: [],
  });

  const { data: events } = useQuery({
    queryKey: ["admin-events"],
    queryFn: () => base44.entities.AnalyticsEvent.list("-created_date", 500),
    initialData: [],
  });

  const { data: variants } = useQuery({
    queryKey: ["admin-variants"],
    queryFn: () => base44.entities.PageVariant.list(),
    initialData: [],
  });

  const today = new Date().toISOString().split("T")[0];
  const leadsToday = leads.filter(l => l.created_date?.startsWith(today)).length;
  const views = events.filter(e => e.event_type === "page_view").length;
  const clicks = events.filter(e => e.event_type === "cta_click").length;
  const submissions = events.filter(e => e.event_type === "form_submit").length;
  const conversionRate = views > 0 ? ((submissions / views) * 100).toFixed(1) : "0";

  const statusColors = {
    new: "bg-blue-500/20 text-blue-400",
    contacted: "bg-yellow-500/20 text-yellow-400",
    qualified: "bg-purple-500/20 text-purple-400",
    booked: "bg-green-500/20 text-green-400",
    not_a_fit: "bg-red-500/20 text-red-400",
  };

  const variantStats = variants.map(v => {
    const vViews = events.filter(e => e.event_type === "page_view" && e.variant === v.slug).length;
    const vSubmits = events.filter(e => e.event_type === "form_submit" && e.variant === v.slug).length;
    const vRate = vViews > 0 ? ((vSubmits / vViews) * 100).toFixed(1) : "0";
    return { ...v, views: vViews, submits: vSubmits, rate: vRate };
  });

  return (
    <AdminLayout currentPage="AdminDashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Overview of your funnel performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Leads", value: leads.length, icon: Users, color: "text-blue-400" },
          { label: "Leads Today", value: leadsToday, icon: ArrowUpRight, color: "text-green-400" },
          { label: "Page Views", value: views, icon: Eye, color: "text-purple-400" },
          { label: "CTA Clicks", value: clicks, icon: MousePointer, color: "text-amber-400" },
          { label: "Conversion", value: `${conversionRate}%`, icon: TrendingUp, color: "text-emerald-400" },
        ].map((s, i) => (
          <Card key={i} className="bg-white/[0.03] border-white/[0.06]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-light text-white">{s.value}</div>
              <div className="text-xs text-white/30 mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Variant Performance */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {variantStats.map(v => (
          <Card key={v.id} className="bg-white/[0.03] border-white/[0.06]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base font-medium flex items-center gap-2">
                {v.name}
                <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">{v.traffic_percent}% traffic</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl text-white font-light">{v.views}</div>
                  <div className="text-xs text-white/30">Views</div>
                </div>
                <div>
                  <div className="text-xl text-white font-light">{v.submits}</div>
                  <div className="text-xs text-white/30">Submissions</div>
                </div>
                <div>
                  <div className="text-xl text-white font-light">{v.rate}%</div>
                  <div className="text-xs text-white/30">Conversion</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card className="bg-white/[0.03] border-white/[0.06]">
        <CardHeader>
          <CardTitle className="text-white text-base font-medium">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/30 font-normal py-3 pr-4">Name</th>
                  <th className="text-left text-white/30 font-normal py-3 pr-4">Email</th>
                  <th className="text-left text-white/30 font-normal py-3 pr-4">Date</th>
                  <th className="text-left text-white/30 font-normal py-3 pr-4">Variant</th>
                  <th className="text-left text-white/30 font-normal py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map(lead => (
                  <tr key={lead.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 text-white/80">{lead.name}</td>
                    <td className="py-3 pr-4 text-white/50">{lead.email}</td>
                    <td className="py-3 pr-4 text-white/40">{lead.created_date ? format(new Date(lead.created_date), "MMM d, HH:mm") : "-"}</td>
                    <td className="py-3 pr-4"><Badge className="bg-white/5 text-white/40 text-[10px]">{lead.funnel_variant || "-"}</Badge></td>
                    <td className="py-3"><Badge className={`${statusColors[lead.status] || statusColors.new} text-[10px]`}>{lead.status || "new"}</Badge></td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-white/20">No leads yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}