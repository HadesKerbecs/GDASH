import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useToast } from "@/components/ui/use-toast"; // <-- ADICIONE ISSO

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

export function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description:
          err.response?.data?.message ?? "Usuário ou senha inválidos.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: "#e5e5e5" }}
    >
      <Card
        className="
          rounded-lg border 
          !shadow-[0_4px_20px_rgba(0,0,0,0.25)]
        "
        style={{
          width: "420px",
          backgroundColor: "#ffffff",
          borderColor: "#d5d5d5",
          color: "#333333",
        }}
      >
        <CardHeader className="text-center pb-1 pt-6">
          <CardTitle
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#0b6e78",
            }}
          >
            Login
          </CardTitle>
        </CardHeader>

        <Separator style={{ backgroundColor: "#2ca1ae", height: "2px" }} />

        <CardContent className="px-6 pt-6 pb-4">
          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: "14px", color: "#0b6e78" }}>
                Seu e-mail
              </label>

              <Input
                type="email"
                placeholder="contato@htmlecsspro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* SENHA */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: "14px", color: "#0b6e78" }}>
                Sua senha
              </label>

              <Input
                type="password"
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* BOTÃO */}
            <Button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "40px",
                backgroundColor: loading ? "#78bfc7" : "#2ca1ae",
                color: "white",
                fontWeight: 600,
                borderRadius: "4px",
              }}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Entrando...</span>
                </>
              ) : (
                "Logar"
              )}
            </Button>

          </form>
        </CardContent>

        <Separator style={{ backgroundColor: "#2ca1ae", height: "2px" }} />

        <CardFooter
          className="flex justify-center py-4"
          style={{
            backgroundColor: "#dfecee",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#666" }}>
            Ainda não tem conta?
            <Link
              to="/register"
              style={{
                marginLeft: "8px",
                padding: "3px 8px",
                backgroundColor: "#f8f4c6",
                border: "1px solid #e0d99a",
                borderRadius: "2px",
                color: "#0b6e78",
                fontWeight: 600,
              }}
            >
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
