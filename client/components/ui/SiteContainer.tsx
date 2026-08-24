import type { ReactNode } from "react";

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function SiteContainer({
  children,
  className = "",
}: SiteContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[82rem] px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}