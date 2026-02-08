import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ currentPage, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-stone-950">
      <AdminSidebar currentPage={currentPage} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"} p-6 md:p-8`}>
        {children}
      </main>
    </div>
  );
}