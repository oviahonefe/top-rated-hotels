"use client";

import { createContext, useContext, useState } from "react";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminSidebar from "@/components/layout/AdminSidebar";

const AdminShellContext = createContext(false);

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const isNestedShell = useContext(AdminShellContext);

  if (isNestedShell) {
    return <>{children}</>;
  }

  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <AdminShellContext.Provider value>
      <div className="min-h-screen bg-[#f4f6fa]">
        <AdminSidebar
          open={navigationOpen}
          onClose={() => setNavigationOpen(false)}
        />

        <div className="lg:pl-72">
          <AdminHeader onMenuOpen={() => setNavigationOpen(true)} />
          {children}
        </div>
      </div>
    </AdminShellContext.Provider>
  );
}