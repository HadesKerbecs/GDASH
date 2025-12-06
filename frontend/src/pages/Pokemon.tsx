import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PokemonItem = {
  id: string;
  name: string;
  image: string;
};

export default function Pokemon() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = Number(searchParams.get("page") || "1");

  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [pokemons, setPokemons] = useState<PokemonItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<PokemonItem[] | null>(null);

  const darkBg = "#0d0f18";
  const lightBg = "#ffffff";
  const borderDark = "#2a2f37";
  const borderLight = "#dcdcdc";
  const primaryColor = theme === "dark" ? "#a855f7" : "#0b6e78";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/pokemon?page=${page}`
        );
        if (!res.ok) {
          throw new Error("Erro ao carregar lista de Pokémon");
        }
        const data = await res.json();
        setPokemons(data.results);
        setTotalPages(data.totalPages);
        setSearchParams({ page: String(page) }, { replace: true });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    if (!searchTerm.trim()) {
      load();
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const q = searchTerm.trim();

    if (!q) {
      setSearchError(null);
      setSearchResult(null);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    setSearchLoading(true);
    setSearchError(null);

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/pokemon/search?q=${encodeURIComponent(q)}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            if (!cancelled) {
              setSearchResult([]);
              setSearchError("Pokémon não encontrado.");
            }
            return;
          }

          throw new Error("Erro ao buscar Pokémon");
        }

        const data = await res.json();

        if (!cancelled) {
          const item: PokemonItem = {
            id: String(data.id),
            name: data.name,
            image: data.image || data.sprites?.front_default || "",
          };
          setSearchResult([item]);
          setSearchError(null);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setSearchError("Erro ao buscar Pokémon.");
          setSearchResult([]);
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [searchTerm]);

  const handlePrev = () => {
    if (page <= 1) return;
    setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    setPage((p) => p + 1);
  };

  const listToShow: PokemonItem[] =
    searchTerm.trim() && searchResult !== null ? searchResult : pokemons;

  const isFiltering = !!searchTerm.trim();

  const inputStyle: React.CSSProperties = {
    backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#111827",
  };

  return (
    <DashboardLayout cidade="Pokémon">
      <div
        className="p-6 space-y-8"
        style={{
          backgroundColor: theme === "dark" ? darkBg : "#f0f8ff",
          minHeight: "100vh",
          color: theme === "dark" ? "#ffffff" : "#0b6e78",
        }}
      >
        <h1 className="text-3xl font-bold">Pokémons</h1>

        {/* BUSCA GLOBAL (nome ou ID) EM TEMPO REAL */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
          <input
            type="text"
            placeholder="Buscar pelo nome ou ID (ex: pikachu, 25)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
            className="
              flex-1 px-4 py-2 rounded-md border shadow-sm
              placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-purple-400
            "
          />
        </div>
        {searchLoading && (
          <p className="text-sm text-gray-500 mt-1">Buscando...</p>
        )}
        {searchError && (
          <p className="text-red-500 text-sm mt-1">{searchError}</p>
        )}

        {/* LISTA EM GRID 3 COLUNAS */}
        {loading && !isFiltering ? (
          <p>Carregando Pokémons...</p>
        ) : listToShow.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">
            Nenhum Pokémon encontrado.
          </p>
        ) : (
          <div
            className="gap-6"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            }}
          >
            {listToShow.map((p) => (
              <Card
                key={p.id}
                className="shadow-md cursor-pointer hover:scale-105 transition"
                onClick={() => navigate(`/pokemon/${p.id}?page=${page}`)}
                style={{
                  backgroundColor: theme === "dark" ? darkBg : lightBg,
                  border:
                    theme === "dark"
                      ? `1px solid ${borderDark}`
                      : `1px solid ${borderLight}`,
                  color: theme === "dark" ? "#ffffff" : "#0b6e78",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-center capitalize">
                    {p.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <img src={p.image} alt={p.name} className="w-20 h-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* PAGINAÇÃO (desabilitada quando estiver filtrando) */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            onClick={handlePrev}
            disabled={isFiltering || page === 1}
            className="px-6 py-2 font-semibold rounded-md"
            style={{
              backgroundColor:
                isFiltering || page === 1 ? "#6b72803b" : primaryColor,
              color: "#ffffff",
            }}
          >
            ← Anterior
          </Button>

          <span className="font-medium">
            Página {page} de {totalPages}
          </span>

          <Button
            onClick={handleNext}
            disabled={isFiltering || page === totalPages}
            className="px-6 py-2 font-semibold rounded-md"
            style={{
              backgroundColor:
                isFiltering || page === totalPages
                  ? "#6b72803b"
                  : primaryColor,
              color: "#ffffff",
            }}
          >
            Próxima →
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
