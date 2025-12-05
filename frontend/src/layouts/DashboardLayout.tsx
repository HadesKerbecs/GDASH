import type { PropsWithChildren } from "react";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { useTheme } from "@/context/ThemeContext";

export function DashboardLayout({
  children,
  cidade,
}: PropsWithChildren & { cidade?: string }) {
  const { theme } = useTheme();

  const bg = theme === "dark" ? "#07090f" : "#ffffff";
  const text = theme === "dark" ? "#ffffff" : "#000000";

  return (
    <div
      className="flex min-h-screen relative z-0"
      style={{
        backgroundColor: bg,
        color: text,
      }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar cidade={cidade} />

        <main
          className="flex-1 p-6 overflow-y-auto"
          style={{
            backgroundColor: bg,
            color: text,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
