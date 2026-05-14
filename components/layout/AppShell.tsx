import type { ReactNode } from "react";
import { AppNav } from "@/components/layout/AppNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main>{children}</main>
    </div>
  );
}
