"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export default function SiteFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}