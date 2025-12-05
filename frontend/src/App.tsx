import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Pokemon from "@/pages/Pokemon";
import PokemonDetail from "@/pages/PokemonDetail";
import Users from "@/pages/Users";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pokemon"
          element={
            <ProtectedRoute>
              <Pokemon />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pokemon/:id"
          element={
            <ProtectedRoute>
              <PokemonDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
