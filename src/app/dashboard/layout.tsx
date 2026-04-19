import type { ReactNode } from "react";

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {children}
    </div>
  );
}
