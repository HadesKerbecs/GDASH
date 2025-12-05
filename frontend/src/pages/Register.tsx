import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useToast } from "@/components/ui/use-toast";

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

export function RegisterPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/auth/register", {
        name,
        email,
        password,
      });

      toast({
        title: "Conta criada!",
        description: "Seu usuário foi registrado com sucesso!",
      });

      navigate("/login");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Falha ao registrar",
        description:
          err.response?.data?.message ??
          "Erro inesperado ao criar usuário.",
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
        {/* TÍTULO */}
        <CardHeader className="text-center pb-1 pt-6">
          <CardTitle
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#0b6e78",
            }}
          >
            Criar Conta
          </CardTitle>
        </CardHeader>

        {/* LINHA IGUAL AO LOGIN */}
        <Separator style={{ backgroundColor: "#2ca1ae", height: "2px" }} />

        {/* FORMULÁRIO */}
        <CardContent className="px-6 pt-6 pb-4">
          <form onSubmit={handleRegister} className="space-y-4">

            {/* NOME */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: "14px", color: "#0b6e78" }}>
                Nome completo
              </label>

              <Input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #c7c7c7",
                  color: "#333333",
                }}
              />
            </div>

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
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #c7c7c7",
                  color: "#333333",
                }}
              />
            </div>

            {/* SENHA */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: "14px", color: "#0b6e78" }}>
                Sua senha
              </label>

              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #c7c7c7",
                  color: "#333333",
                }}
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
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.85 : 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                transition: "opacity 0.25s ease, background-color 0.25s ease",
              }}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Registrando...</span>
                </>
              ) : (
                "Registrar"
              )}
            </Button>


          </form>
        </CardContent>

        {/* LINHA INFERIOR */}
        <Separator style={{ backgroundColor: "#2ca1ae", height: "2px" }} />

        {/* RODAPÉ */}
        <CardFooter
          className="flex justify-center py-4"
          style={{
            backgroundColor: "#dfecee",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#666" }}>
            Já possui uma conta?
            <Link
              to="/login"
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
              Faça login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
