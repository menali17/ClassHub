"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, BookOpen, TrendingUp, ClipboardList, AlertTriangle, Target, UserCog } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import StatCard from "./StatCard";
import AlunosFaltososList from "@/components/frequencia/AlunosFaltososList";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDashboard,
  getTurmas,
  getApiHealth,
  getAlunos,
  getAlunosBaixaFrequencia,
} from "@/lib/api";
import {
  fetchFrequenciasAlunos,
  calcTaxaMediaPresenca,
  aggregateFrequenciaPorTurma,
  normalizeAlunosFaltosos,
} from "@/lib/frequenciaHelpers";

function ChartEmptyState({ message }) {
  return (
    <div className="flex items-center justify-center h-[200px] text-neutral-400 text-sm text-center px-4">
      {message}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [dash, setDash] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [faltosos, setFaltosos] = useState([]);
  const [taxaCalculada, setTaxaCalculada] = useState(null);
  const [chartTurmas, setChartTurmas] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [freqError, setFreqError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setFreqError("");

      const [dashRes, turmasRes, healthRes, faltososRes] = await Promise.allSettled([
        getDashboard(),
        getTurmas(),
        getApiHealth(),
        getAlunosBaixaFrequencia(),
      ]);

      const dashData = dashRes.status === "fulfilled" ? dashRes.value : null;
      const turmasData =
        turmasRes.status === "fulfilled" && Array.isArray(turmasRes.value) ? turmasRes.value : [];
      const healthData = healthRes.status === "fulfilled" ? healthRes.value : null;

      setDash(dashData);
      setTurmas(turmasData);
      setHealth(healthData);
      const reportFaltosos =
        faltososRes.status === "fulfilled" && Array.isArray(faltososRes.value?.alunos)
          ? faltososRes.value.alunos
          : null;
      const dashboardFaltosos = Array.isArray(dashData?.alunosComBaixaFrequencia)
        ? normalizeAlunosFaltosos(dashData.alunosComBaixaFrequencia)
        : [];
      setFaltosos(normalizeAlunosFaltosos(reportFaltosos ?? dashboardFaltosos));

      try {
        const alunos = await getAlunos();
        const freqData = await fetchFrequenciasAlunos(Array.isArray(alunos) ? alunos : []);
        setTaxaCalculada(calcTaxaMediaPresenca(freqData));
        const agregado = aggregateFrequenciaPorTurma(freqData);
        setChartTurmas(agregado);
      } catch (err) {
        setFreqError(err.message || "Erro ao calcular frequências.");
      } finally {
        setLoading(false);
      }
    }

    if (user) load();
  }, [user]);

  const registros = health?.database?.registros ?? {};
  const totalAlunos = dash?.totalAlunos ?? registros.alunos ?? 0;
  const totalAulas = dash?.totalAulas ?? registros.aulas ?? 0;
  const totalProfessores = dash?.totalProfessores ?? registros.professores ?? 0;
  const turmasDisplay = turmas;
  const totalTurmas = dash?.totalTurmas ?? turmasDisplay.length;
  const frequenciaGeral =
    dash?.taxaMediaPresenca ?? taxaCalculada ?? (totalAulas > 0 ? null : 0);
  const metaFrequencia = dash?.limiteBaixaFrequencia ?? registros.limiteBaixaFrequencia ?? 75;
  const alunosRisco = faltosos;
  const temEvolucaoSemanal = Array.isArray(dash?.evolucaoSemanal) && dash.evolucaoSemanal.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Dashboard Analítico</h1>
        <p className="text-caption text-bg-muted mt-1">Visão geral do sistema de frequência</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total de alunos" value={totalAlunos} icon={Users} />
        <StatCard
          title="Total de aulas"
          value={totalAulas}
          icon={ClipboardList}
          iconBg="bg-purple-100"
          iconColor="text-purple-700"
        />
        <StatCard
          title="Turmas cadastradas"
          value={totalTurmas}
          icon={BookOpen}
          iconBg="bg-blue-100"
          iconColor="text-info"
        />
        <StatCard
          title="Frequência média"
          value={frequenciaGeral != null ? `${Math.round(frequenciaGeral)}%` : "—"}
          icon={TrendingUp}
          iconBg={(frequenciaGeral ?? 0) >= 75 ? "bg-green-100" : "bg-red-100"}
          iconColor={(frequenciaGeral ?? 0) >= 75 ? "text-success" : "text-error"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Professores ativos"
          value={totalProfessores}
          icon={UserCog}
          iconBg="bg-blue-100"
          iconColor="text-info"
        />
        <StatCard
          title="Alunos em risco (&lt;75%)"
          value={alunosRisco.length}
          icon={AlertTriangle}
          iconBg="bg-red-100"
          iconColor="text-error"
          valueColor="text-error"
        />
        <StatCard
          title="Meta de frequência"
          value={`${metaFrequencia}%`}
          icon={Target}
          iconBg="bg-orange-100"
          iconColor="text-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-bg-card rounded-xl border border-bg-border shadow-card p-5">
          <h3 className="text-h4 font-semibold mb-1">Evolução Semanal</h3>
          <p className="text-caption text-neutral-400 mb-4">
            {temEvolucaoSemanal ? "Percentual médio por semana" : "Sem chamadas finalizadas"}
          </p>
          {temEvolucaoSemanal ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dash.evolucaoSemanal}>
                <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <ReferenceLine
                  y={metaFrequencia}
                  stroke="#dc2626"
                  strokeDasharray="4 4"
                  label={{ value: `${metaFrequencia}%`, fill: "#dc2626", fontSize: 11 }}
                />
                <Line type="monotone" dataKey="valor" stroke="#FFA500" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState message="Registre chamadas para visualizar a evolução semanal." />
          )}
        </div>

        <div className="bg-bg-card rounded-xl border border-bg-border shadow-card p-5">
          <h3 className="text-h4 font-semibold mb-1">Frequência por Turma</h3>
          <p className="text-caption text-neutral-400 mb-4">
            {chartTurmas.length > 0 ? "Calculado a partir dos alunos" : "Sem aulas registradas ainda"}
          </p>
          {chartTurmas.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartTurmas}>
                <XAxis dataKey="codigo" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <ReferenceLine y={metaFrequencia} stroke="#dc2626" strokeDasharray="4 4" />
                <Bar dataKey="frequencia" fill="#FFA500" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState message="Registre chamadas para visualizar a frequência por turma." />
          )}
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-bg-border">
          <h3 className="text-h4 font-semibold">Turmas Cadastradas</h3>
          <Link href="/dashboard/turmas" className="text-sm text-orange-500 hover:text-orange-400 font-medium">
            Gerenciar
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-caption text-neutral-500 border-b border-bg-border">
                <th className="px-5 py-3 font-medium">Turma</th>
                <th className="px-5 py-3 font-medium hidden md:table-cell">Código</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Horário</th>
                <th className="px-5 py-3 font-medium">Alunos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {turmasDisplay.map((t) => (
                <tr key={t.id} className="hover:bg-bg-light transition-colors">
                  <td className="px-5 py-3 font-medium">{t.nome}</td>
                  <td className="px-5 py-3 text-neutral-500 hidden md:table-cell">{t.codigo}</td>
                  <td className="px-5 py-3 text-neutral-500 hidden sm:table-cell">{t.horario}</td>
                  <td className="px-5 py-3 text-neutral-500">{t.quantidadeAlunos ?? "—"}</td>
                </tr>
              ))}
              {turmasDisplay.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-neutral-500 text-sm">
                    Nenhuma turma cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-bg-border">
          <div>
            <h3 className="text-h4 font-semibold">Alunos com baixa frequência</h3>
            <p className="text-caption text-neutral-500">Frequência abaixo de {metaFrequencia}%</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-red-100 text-error px-2 py-0.5 rounded-full font-semibold">
              {alunosRisco.length} aluno(s)
            </span>
            <Link
              href="/dashboard/relatorios?aba=faltosos"
              className="text-sm text-orange-500 hover:text-orange-400 font-medium"
            >
              Ver relatório →
            </Link>
          </div>
        </div>
        <AlunosFaltososList
          alunos={alunosRisco}
          loading={false}
          error={freqError}
          showStats
        />
      </div>
    </div>
  );
}
