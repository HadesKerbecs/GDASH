// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import axios from "axios";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster, toastGlobal } from "@/components/ui/use-toast";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const hasToken = !!localStorage.getItem("token");

    if (status === 401 && hasToken) {
      localStorage.removeItem("token");

      toastGlobal({
        variant: "destructive",
        title: "Sessão expirada",
        description: "Faça login novamente.",
      });

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Toaster>
        <App />
      </Toaster>
    </ThemeProvider>
  </React.StrictMode>
);
