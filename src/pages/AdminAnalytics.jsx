import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Eye, MousePointer, FileText, Smartphone, Monitor, Tablet } from "lucide-react";

export default function AdminAnalytics() {
  const { data: events } = useQuery({
    queryKey: ["admin-analytics-events"],
    queryFn: () => base44.entities.AnalyticsEvent.list("-created_date", 2000),
    initialData: [],
  });

  const views = events.filter(e => e.event_type === "page_view").length;
  const clicks = events.filter(e => e.event_type === "cta_click").length;
  const formStarts = events.filter(e => e.event_type === "form_start").length;
  const submits = events.filter(e => e.event_type === "form_submit").length;
  const thankYous = events.filter(e => e.event_type === "thankyou_view").length;

  // Funnel data
  const funnelData = [
    { name: "Page Views", value: views },
    { name: "CTA Clicks", value: clicks },
    { name: "Form Submits", value: submits },
    { name: "Thank You", value: thankYous },
  ];

  // Device data
  const mobile = events.filter(e => e.device_type === "mobile").length;
  const tablet = events.filter(e => e.device_type === "tablet").length;
  const desktop = events.filter(e => e.device_type === "desktop").length;
  const deviceData = [
    { name: "Mobile", value: mobile },
    { name: "Tablet", value: tablet },
    { name: "Desktop", value: desktop },
  ];
  const deviceColors = ["#d97706", "#7c3aed", "#0891b2"];

  // Variant comparison
  const variantSlug = [...new Set(events.map(e => e.variant).filter(Boolean))];
  const variantCompare = variantSlug.map(slug => ({
    name: slug,
    views: events.filter(e => e.variant === slug && e.event_type === "page_view").length,
    clicks: events.filter(e => e.variant === slug && e.event_type === "cta_click").length,
    submits: events.filter(e => e.variant === slug && e.event_type === "form_submit").length,
  }));

  // Daily trend
  const dailyMap = {};
  events.forEach(e => {
    const day = e.created_date?.split("T")[0];
    if (day) {
      if (!dailyMap[day]) dailyMap[day] = { date: day, views: 0, submits: 0 };
      if (e.event_type === "page_view") dailyMap[day].views++;
      if (e.event_type === "form_submit") dailyMap[day].submits++;
    }
  });
  const dailyData = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);

  return (
    <AdminLayout currentPage="AdminAnalytics">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-white">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Funnel performance insights</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Page Views", value: views, icon: Eye },
          { label: "CTA Clicks", value: clicks, icon: MousePointer },
          { label: "Form Starts", value: formStarts, icon: FileText },
          { label: "Submissions", value: submits, icon: FileText },
          { label: "Thank You Views", value: thankYous, icon: Eye },
        ].map((s, i) => (
          <Card key={i} className="bg-white/[0.03] border-white/[0.06]">
            <CardContent className="p-5">
              <s.icon className="w-4 h-4 text-amber-500 mb-2" />
              <div className="text-2xl font-light text-white">{s.value}</div>
              <div className="text-xs text-white/30 mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Funnel Chart */}
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader><CardTitle className="text-white text-base font-medium">Funnel Flow</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1c1917", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} />
                  <Bar dataKey="value" fill="#d97706" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader><CardTitle className="text-white text-base font-medium">Device Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {deviceData.map((_, i) => <Cell key={i} fill={deviceColors[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1c1917", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Trend */}
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader><CardTitle className="text-white text-base font-medium">Daily Trend (14 days)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1c1917", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} />
                  <Line type="monotone" dataKey="views" stroke="#d97706" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="submits" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Variant Comparison */}
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader><CardTitle className="text-white text-base font-medium">Variant Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={variantCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1c1917", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} />
                  <Bar dataKey="views" fill="#d97706" radius={[4, 4, 0, 0]} name="Views" />
                  <Bar dataKey="clicks" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Clicks" />
                  <Bar dataKey="submits" fill="#22c55e" radius={[4, 4, 0, 0]} name="Submits" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}