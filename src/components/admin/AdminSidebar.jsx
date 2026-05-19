import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard, Users, FileText, TestTubes, Image, Star,
  HelpCircle, Settings, Zap, BarChart3, ChevronLeft, ChevronRight, ClipboardList,
  PenTool, FormInput, Search, BookOpen
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, page: "AdminDashboard" },
  { label: "Leads", icon: Users, page: "AdminLeads" },
  { label: "Survey", icon: ClipboardList, page: "AdminSurvey" },
  { label: "Landing Pages", icon: FileText, page: "AdminPages" },
  { label: "A/B Testing", icon: TestTubes, page: "AdminABTest" },
  { label: "Media Library", icon: Image, page: "AdminMedia" },
  { label: "Testimonials", icon: Star, page: "AdminTestimonials" },
  { label: "FAQs", icon: HelpCircle, page: "AdminFAQs" },
  { label: "Automations", icon: Zap, page: "AdminAutomations" },
  { label: "Analytics", icon: BarChart3, page: "AdminAnalytics" },
  { label: "Settings", icon: Settings, page: "AdminSettings" },
  { label: "Quiz Builder", icon: PenTool, page: "AdminQuizBuilder" },
  { label: "Contact Forms", icon: FormInput, page: "AdminContactForms" },
  { label: "SEO Manager", icon: Search, page: "AdminSEOManager" },
  { label: "Blog Builder", icon: BookOpen, page: "AdminBlogBuilder" },
];

export default function AdminSidebar({ currentPage, collapsed, onToggle }) {
  return (
    <aside className={`fixed left-0 top-0 h-full bg-stone-900 border-r border-white/5 z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        {!collapsed && <span className="text-white font-medium text-sm">Admin Panel</span>}
        <button onClick={onToggle} className="text-white/40 hover:text-white transition-colors p-1">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      <nav className="mt-4 space-y-1 px-2">
        {navItems.map((item) => {
          const active = currentPage === item.page;
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}