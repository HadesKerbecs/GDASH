import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

type Stat = { name: string; value: number };

type PokemonDetailData = {
  id: number;
  name: string;
  height: number;
  weight: number;
  image: string;
  types: string[];
  abilities: string[];
  stats: Stat[];
};

export default function PokemonDetail() {
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [pokemon, setPokemon] = useState<PokemonDetailData | null>(null);
  const [loading, setLoading] = useState(false);

  const page = searchParams.get("page");

  const darkBg = "#0d0f18";
  const lightBg = "#ffffff";
  const borderColor = theme === "dark" ? "#2a2f37" : "#dcdcdc";
  const primaryColor = theme === "dark" ? "#a855f7" : "#0b6e78";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/pokemon/${id}`);
        const data = await res.json();
        setPokemon(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleBack = () => {
    if (page) {
      navigate(`/pokemon?page=${page}`);
    } else {
      navigate(-1);
    }
  };

  if (loading || !pokemon) {
    return (
      <DashboardLayout cidade={`Pokémon – Carregando`}>
        <div
          className="p-6"
          style={{
            backgroundColor: theme === "dark" ? darkBg : "#f0f8ff",
            minHeight: "100vh",
          }}
        >
          Carregando...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout cidade={`Pokémon – ${pokemon.name}`}>
      <div
        className="p-6 space-y-8"
        style={{
          backgroundColor: theme === "dark" ? darkBg : "#f0f8ff",
          minHeight: "100vh",
          color: theme === "dark" ? "#ffffff" : "#0b6e78",
        }}
      >
        {/* Botão Voltar */}
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-md font-semibold mb-4"
          style={{
            backgroundColor: primaryColor,
            color: "#ffffff",
          }}
        >
          ← Voltar
        </button>

        <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagem */}
          <Card
            className="flex items-center justify-center"
            style={{ backgroundColor: "transparent", borderColor }}
          >
            <CardContent className="p-8 flex flex-col items-center gap-4">
              <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32" />
              <p>
                <strong>Tipos:</strong> {pokemon.types.join(", ")}
              </p>
            </CardContent>
          </Card>

          {/* Informações */}
          <Card style={{ backgroundColor: "transparent", borderColor }}>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base">
              <p>
                <strong>Habilidades:</strong> {pokemon.abilities.join(", ")}
              </p>
              <p className="text-lg">
                <strong>Peso:</strong> {pokemon.weight}
              </p>
              <p className="text-lg">
                <strong>Altura:</strong> {pokemon.height}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Base */}
        <Card style={{ backgroundColor: "transparent", borderColor }}>
          <CardHeader>
            <CardTitle>Status Base</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-1">
              {pokemon.stats.map((s) => (
                <li key={s.name}>
                  <strong>{s.name}: </strong>
                  {s.value}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
