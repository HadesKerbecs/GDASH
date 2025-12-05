// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTheme } from "@/context/ThemeContext";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// IMPORTS DO SHADCN (OBRIGATÓRIO)
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function Dashboard() {
  const { theme } = useTheme();

  const darkBg = "#0d0f18"; // Fundo tema escuro
  const lightBg = "#ffffff";

  const [logs, setLogs] = useState<any[]>([]);
  const [insights, setInsights] = useState<any | null>(null);

  const last = logs[0];

  useEffect(() => {
    async function load() {
      try {
        const [logsRes, insightsRes] = await Promise.all([
          fetch("http://localhost:3000/api/weather/logs"),
          fetch("http://localhost:3000/api/weather/insights"),
        ]);

        setLogs(await logsRes.json());
        setInsights(await insightsRes.json());
      } catch (e) {
        console.error("Erro ao carregar:", e);
      }
    }

    load();
  }, []);

  const chartData = logs.map((r) => ({
    ...r,
    time: new Date(r.timestamp).toLocaleTimeString(),
  }));

  // CORES DE TEXTO, EIXO E GRID (COMPORTAMENTO DO TEMA)
  const colors = {
    text: theme === "dark" ? "#ffffff" : "#0b6e78",
    axis: theme === "dark" ? "#ffffff" : "#333333",
    grid: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
  };

  const buttonColor = theme === "dark" ? "#a855f7" : "#2ca1ae";

  return (
    <DashboardLayout cidade={insights?.cidade}>
      <div
        className="p-6 space-y-8 lg:space-y-10"
        style={{
          backgroundColor: theme === "dark" ? darkBg : lightBg,
          minHeight: "100vh",
          color: colors.text,
        }}
      >
        <h1 className="text-3xl font-bold">Gráfico e Dados</h1>

        {/* BOTÕES */}
        <div className="flex flex-wrap gap-3">
          <Button
            className="px-6 py-3 text-lg flex items-center gap-2"
            onClick={() => window.open("http://localhost:3000/api/weather/export.csv")}
            style={{
              background: buttonColor,
              color: "white",
            }}
          >
            📄 Exportar CSV
          </Button>

          <Button
            className="px-6 py-3 text-lg flex items-center gap-2"
            onClick={() => window.open("http://localhost:3000/api/weather/export.xlsx")}
            style={{
              background: buttonColor,
              color: "white",
            }}
          >
            📄 Exportar XLSX
          </Button>
        </div>

        {/* CARDS PRINCIPAIS */}
        {last && (
          <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6">
            {[
              ["🌡️ Temperatura", `${last.temperature_c}°C`],
              ["💧 Umidade", `${last.humidity}%`],
              ["💨 Vento", `${last.wind_speed_m_s} m/s`],
              ["☔ Chuva", `${last.precipitation_probability}%`],
              ["🕒 Atualização", new Date(last.timestamp).toLocaleString()],
            ].map(([t, v], index) => (
              <Card
                key={index}
                className="shadow-md border"
                style={{
                  backgroundColor: theme === "dark" ? darkBg : lightBg,
                  color: colors.text,
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {t}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{v}</CardContent>
              </Card>
            ))}
          </section>
        )}

        {/* GRÁFICOS — SHADCN */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* TEMPERATURA */}
          <Card
            className="shadow-md border"
            style={{
              backgroundColor: theme === "dark" ? darkBg : lightBg,
              color: colors.text,
            }}
          >
            <CardHeader>
              <CardTitle>Temperatura ao longo do tempo</CardTitle>
            </CardHeader>

            <CardContent>
              <ChartContainer
                className="w-full h-[280px]"
                config={{
                  temperature_c: {
                    label: "Temperatura (°C)",
                    theme: {
                      light: "#ff4d4d",
                      dark: "#ff7373",
                    },
                  },
                }}
              >
                <LineChart data={chartData}>
                  <CartesianGrid stroke={colors.grid} />
                  <XAxis dataKey="time" stroke={colors.axis} tick={{ fill: colors.axis }} />
                  <YAxis stroke={colors.axis} tick={{ fill: colors.axis }} />

                  <Line
                    dataKey="temperature_c"
                    stroke="var(--color-temperature_c)"
                    strokeWidth={3}
                    dot={false}
                  />

                  <ChartTooltipContent />
                  <ChartLegendContent />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* UMIDADE */}
          <Card
            className="shadow-md border"
            style={{
              backgroundColor: theme === "dark" ? darkBg : lightBg,
              color: colors.text,
            }}
          >
            <CardHeader>
              <CardTitle>Umidade (%)</CardTitle>
            </CardHeader>

            <CardContent>
              <ChartContainer
                className="w-full h-[280px]"
                config={{
                  humidity: {
                    label: "Umidade (%)",
                    theme: {
                      light: "#0095ff",
                      dark: "#3ba9ff",
                    },
                  },
                }}
              >
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="hum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-humidity)" stopOpacity={0.85} />
                      <stop offset="95%" stopColor="var(--color-humidity)" stopOpacity={0.06} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke={colors.grid} />
                  <XAxis dataKey="time" stroke={colors.axis} tick={{ fill: colors.axis }} />
                  <YAxis stroke={colors.axis} tick={{ fill: colors.axis }} />

                  <Area
                    dataKey="humidity"
                    stroke="var(--color-humidity)"
                    fill="url(#hum)"
                    strokeWidth={2}
                  />

                  <ChartTooltipContent />
                  <ChartLegendContent />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* VENTO */}
          <Card
            className="shadow-md border"
            style={{
              backgroundColor: theme === "dark" ? darkBg : lightBg,
              color: colors.text,
            }}
          >
            <CardHeader>
              <CardTitle>Velocidade do Vento (m/s)</CardTitle>
            </CardHeader>

            <CardContent>
              <ChartContainer
                className="w-full h-[280px]"
                config={{
                  wind_speed_m_s: {
                    label: "Vento (m/s)",
                    theme: {
                      light: "#2ca1ae",
                      dark: "#67e8f9",
                    },
                  },
                }}
              >
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" />

                  <XAxis dataKey="time" stroke={colors.axis} />
                  <YAxis stroke={colors.axis} />

                  <Line
                    dataKey="wind_speed_m_s"
                    stroke="var(--color-wind_speed_m_s)"
                    strokeWidth={3}
                    dot={false}
                  />

                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* CHUVA */}
          <Card
            className="shadow-md border"
            style={{
              backgroundColor: theme === "dark" ? darkBg : lightBg,
              color: colors.text,
            }}
          >
            <CardHeader>
              <CardTitle>Probabilidade de Chuva (%)</CardTitle>
            </CardHeader>

            <CardContent>
              <ChartContainer
                className="w-full h-[320px]"
                config={{
                  precipitation_probability: {
                    label: "Chuva (%)",
                    theme: {
                      light: "#005bbb",
                      dark: "#4da3ff",
                    },
                  },
                }}
              >
                <BarChart data={chartData}>
                  <CartesianGrid stroke={colors.grid} />
                  <XAxis dataKey="time" stroke={colors.axis} tick={{ fill: colors.axis }} />
                  <YAxis stroke={colors.axis} tick={{ fill: colors.axis }} />

                  <Bar
                    dataKey="precipitation_probability"
                    fill="var(--color-precipitation_probability)"
                  />

                  <ChartTooltipContent />
                  <ChartLegendContent />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        {/* INSIGHTS */}
        {insights && (
          <section className="mt-10">
            <Card
              className="shadow-md border rounded-lg"
              style={{
                backgroundColor: theme === "dark" ? darkBg : lightBg,
                color: colors.text,
              }}
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Insights de IA — {insights.cidade ?? "—"}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-10">

                {/* GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6">
                  {[
                    ["🌡️ Temperatura Média", `${insights.data?.media_temperatura ?? "—"}°C`],
                    ["💧 Umidade Média", `${insights.data?.media_umidade ?? "—"}%`],
                    ["💨 Vento Médio", `${insights.data?.media_velocidade_vento ?? "—"} m/s`],
                    ["☁️ Clima", insights.data?.classificacao_climatica ?? "—"],
                    ["📉 Tendência", insights.data?.tendencia_temperatura ?? "—"],
                    ["🙂 Conforto", `${insights.data?.conforto_climatico ?? "—"}/100`],
                  ].map(([t, v], idx) => (
                    <Card
                      key={idx}
                      className="shadow-sm border rounded-lg"
                      style={{
                        backgroundColor: theme === "dark" ? darkBg : lightBg,
                        color: colors.text,
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="text-base">{t}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-2xl font-bold">{v}</CardContent>
                    </Card>
                  ))}
                </div>

                {/* ALERTAS */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">⚠️ Alertas</h3>

                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: theme === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "#f8f8f8",
                      borderColor: theme === "dark" ? "#2a2f37" : "#dcdcdc",
                      color: colors.text,
                    }}
                  >
                    {!insights.data?.alertas?.length ? (
                      <p className="text-sm opacity-70">Nenhum alerta registrado.</p>
                    ) : (
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        {insights.data.alertas.map((a: string, idx: number) => (
                          <li
                            key={idx}
                            style={{
                              color: theme === "dark" ? "#ff9b9b" : "#b30000",
                            }}
                          >
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* RESUMO */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">📝 Resumo do Clima</h3>
                  <p className="opacity-90 text-sm leading-relaxed">
                    {insights.data?.resumo ?? "—"}
                  </p>
                </div>

              </CardContent>
            </Card>
          </section>
        )}

        {/* TABELA */}
        <section>
          <Card
            className="shadow-md border"
            style={{
              backgroundColor: theme === "dark" ? darkBg : lightBg,
              color: colors.text,
            }}
          >
            <CardHeader>
              <CardTitle>Registros Climáticos</CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Temperatura</TableHead>
                    <TableHead>Umidade</TableHead>
                    <TableHead>Vento</TableHead>
                    <TableHead>Chuva</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {logs.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>{new Date(r.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{r.temperature_c}°C</TableCell>
                      <TableCell>{r.humidity}%</TableCell>
                      <TableCell>{r.wind_speed_m_s} m/s</TableCell>
                      <TableCell>{r.precipitation_probability}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
