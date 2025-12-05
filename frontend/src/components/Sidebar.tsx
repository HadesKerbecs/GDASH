// src/components/Sidebar.tsx
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className="h-screen w-64 flex flex-col justify-between p-4 border-r"
      style={{
        backgroundColor: theme === "dark" ? "#07090f" : "#fafcff",
        borderColor: theme === "dark" ? "#11131a" : "#e6eaee",
        color: theme === "dark" ? "#ffffff" : "#163e3e",
        position: "sticky",
        top: 0,
      }}
    >
      <div className="space-y-6">
        <h1
          className="text-2xl font-semibold"
          style={{ color: theme === "dark" ? "#ffffff" : "#0b6e78" }}
        >
          SkyPulse
        </h1>

        <nav className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="font-medium"
            style={{
              color: theme === "dark" ? "#c084fc" : "#0b6e78",
            }}
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/pokemon"
            className="flex items-center gap-3 text-lg font-medium"
            style={{
              color: theme === "dark" ? "#c084fc" : "#0b6e78",
            }}
          >
            🐱 Pokémon
          </Link>

          <Link
            to="/users"
            className="flex items-center gap-3 text-lg font-medium"
            style={{
              color: theme === "dark" ? "#c084fc" : "#0b6e78",
            }}
          >
            👥 Usuários
          </Link>
        </nav>
      </div>

      <div className="mt-6">
        <button
          onClick={toggleTheme}
          className="w-full py-3 rounded-md font-semibold transition flex items-center justify-center gap-2"
          style={{
            backgroundColor: theme === "dark" ? "#8b5cf6" : "#2ca1ae",
            color: "white",
            border: `1px solid ${theme === "dark" ? "#7a40f2" : "#238b86"}`,
          }}
        >
          {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
        </button>
      </div>
    </aside>
  );
}
