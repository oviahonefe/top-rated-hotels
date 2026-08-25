import type { Metadata } from "next";
import SiteFrame from "@/components/layouts/SiteFrame";
import "./globals.css";

export const metadata: Metadata = {
  title: "Top Rated Apartment Hotels",
  description:
    "Book top rated apartment hotels and serviced lodges across Europe.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-full bg-background text-foreground">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
