import * as React from "react";
import Toast from "./toast";
import type { ToastVariant } from "./toast";

export type ToastOptions = {
  id?: number | string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  toast: (options: ToastOptions) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <Toaster />");
  return ctx;
}

let externalToast: ((opts: ToastOptions) => void) | null = null;

export function registerToast(fn: (opts: ToastOptions) => void) {
  externalToast = fn;
}

export function toastGlobal(opts: ToastOptions) {
  if (externalToast) {
    externalToast(opts);
  } else {
    console.warn("Toast ainda não inicializado.");
  }
}

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastOptions[]>([]);

  function pushToast(options: ToastOptions) {
    const id = options.id ?? Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...options, id }]);

    setTimeout(() => removeToast(id), 4000);
  }

  function removeToast(id?: number | string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  React.useEffect(() => {
    registerToast(pushToast);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: pushToast }}>
      {children}

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "auto",
        }}
      >
        {toasts.map((t) => (
          <Toast
            key={String(t.id)}
            variant={t.variant}
            onClose={() => removeToast(t.id)}
          >
            {t.title && (
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                {t.title}
              </div>
            )}

            {t.description && (
              <div style={{ fontSize: "13px", opacity: 0.9 }}>
                {t.description}
              </div>
            )}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
