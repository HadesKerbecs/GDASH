import { CircleUserRound } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function Navbar({ cidade }: { cidade?: string }) {
  const { theme } = useTheme();

  const bg = theme === "dark" ? "#07090f" : "#fafcff";
  const border = theme === "dark" ? "#11131a" : "#e6eaee";

  return (
    <nav
      className="w-full h-16 border-b flex items-center justify-between px-6"
      style={{
        backgroundColor: bg,
        borderColor: border,
        color: theme === "dark" ? "#ffffff" : "#0b6e78",
      }}
    >
      <h1 className="text-xl font-semibold">
        SkyPulse {cidade ? `– ${cidade}` : ""}
      </h1>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-md transition font-semibold"
        style={{
          backgroundColor: theme === "dark" ? "#8b5cf6" : "#2ca1ae",
          color: "white",
          border: theme === "dark"
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <CircleUserRound size={18} />
        Sair
      </button>
    </nav>
  );
}
