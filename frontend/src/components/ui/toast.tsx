import * as React from "react";

export type ToastVariant = "default" | "success" | "error" | "destructive";

export interface ToastProps {
  children: React.ReactNode;
  variant?: ToastVariant;
  onClose?: () => void;
}

export default function Toast({ children, variant = "default", onClose }: ToastProps) {
  const background =
    variant === "success"
      ? "#16a34a"
      : variant === "error"
      ? "#dc2626"
      : variant === "destructive"
      ? "#b91c1c"
      : "#1f2937";

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "space-between",
        alignItems: "flex-start",
        maxWidth: "300px",
        width: "100%",
        backgroundColor: background,
        color: "white",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ flex: 1, fontSize: "14px", lineHeight: "18px" }}>
        {children}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            color: "white",
            fontWeight: "bold",
            opacity: 0.8,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            fontSize: "16px",
            lineHeight: "16px",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
