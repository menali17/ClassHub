"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ClipboardList, TrendingUp, AlertTriangle, ClipboardCheck, BookOpen } from "lucide-react";
import StatCard from "./StatCard";
import AlunosFaltososList from "@/components/frequencia/AlunosFaltososList";
import { useAuth } from "@/contexts/AuthContext";
import { useAlunosFaltosos } from "@/hooks/useAlunosFaltosos";
import { getDashboard, getTurmas, getApiHealth } from "@/lib/api";
import { normalizeAlunosFaltosos } from "@/lib/frequenciaHelpers";
import { getFrequencyStatus } from "@/utils/formatters";

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const { faltosos, taxaMedia, loading: loadingFreq, error: freqError } = useAlunosFaltosos(user);
  const [dash, setDash] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getDashboard(), getTurmas(), getApiHealth()])
      .then(([dashRes, turmasRes, healthRes]) => {
        setDash(dashRes.status === "fulfilled" ? dashRes.value : null);
        setTurmas(
          turmasRes.status === "fulfilled" && Array.isArray(turmasRes.value)
            ? turmasRes.value
            : [],
        );
        setHealth(healthRes.status === "fulfilled" ? healthRes.value : null);
      })
      .finally(() => setLoading(false));
  }, []);

  const registros = health?.database?.registros ?? {};
  const totalAlunos =
    dash?.totalAlunos ??
    turmas.reduce((acc, t) => acc + (t.quantidadeAlunos ?? 0), 0);
  const totalAulas = dash?.totalAulas ?? registros.aulas ?? 0;
  const frequenciaMedia = dash?.taxaMediaPresenca ?? taxaMedia ?? null;
  const alunosEmRisco = dash?.alunosComBaixaFrequencia?.length
    ? normalizeAlunosFaltosos(dash.alunosComBaixaFrequencia)
    : faltosos;
  const metaFrequencia = dash?.limiteBaixaFrequencia ?? registros.limiteBaixaFrequencia ?? 75;

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
        <h1 className="text-h2 font-bold text-neutral-900">Dashboard</h1>
        <p className="text-caption text-bg-muted mt-1">Acompanhe suas turmas e frequências</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Alunos nas turmas" value={totalAlunos} icon={Users} />
        <StatCard
          title="Aulas ministradas"
          value={totalAulas}
          icon={ClipboardList}
          iconBg="bg-purple-100"
          iconColor="text-purple-700"
        />
        <StatCard
          title="Frequência média"
          value={frequenciaMedia != null ? `${Math.round(frequenciaMedia)}%` : "—"}
          icon={TrendingUp}
          iconBg="bg-green-100"
          iconColor="text-success"
        />
        <StatCard
          title="Alunos em risco"
          value={alunosEmRisco.length}
          icon={AlertTriangle}
          iconBg="bg-red-100"
          iconColor="text-error"
          valueColor="text-error"
        />
      </div>

      <div className="bg-orange-500 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
            <ClipboardCheck size={20} color="black" />
          </div>
          <div>
            <p className="font-bold text-black">Registrar frequência agora</p>
            <p className="text-sm text-black/70">Inicie a chamada para uma de suas turmas</p>
          </div>
        </div>
        <Link
          href="/dashboard/frequencia/chamada"
          className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-bold hover:bg-neutral-700 transition-colors whitespace-nowrap"
        >
          Iniciar chamada
        </Link>
      </div>

      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-bg-border">
          <h3 className="text-h4 font-semibold">Minhas Turmas</h3>
          <Link href="/dashboard/turmas" className="text-sm text-orange-500 hover:text-orange-400 font-medium">
            Ver todas
          </Link>
        </div>
        <div className="divide-y divide-bg-border">
          {turmas.length === 0 ? (
            <p className="text-center py-10 text-neutral-500 text-sm">Nenhuma turma encontrada.</p>
          ) : (
            turmas.map((t) => (
              <div key={t.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{t.nome}</p>
                  <p className="text-caption text-neutral-500">
                    {t.horario} · {t.quantidadeAlunos ?? 0} alunos
                  </p>
                </div>
                <Link
                  href={`/dashboard/turmas/${t.id}`}
                  className="text-xs text-orange-500 hover:text-orange-400 font-medium"
                >
                  Ver →
                </Link>
              </div>
            ))
          )}
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
              {alunosEmRisco.length}
            </span>
            <Link
              href="/dashboard/relatorios?aba=faltosos"
              className="text-sm text-orange-500 hover:text-orange-400 font-medium"
            >
              Ver relatório →
            </Link>
          </div>
        </div>
        {dash?.alunosComBaixaFrequencia?.length ? (
          <div className="divide-y divide-bg-border">
            {alunosEmRisco.map((a, index) => {
              const st = getFrequencyStatus(a.percentualPresenca);
              return (
                <div key={`${a.id ?? a.matricula ?? a.nome}-${a.turmaId ?? a.turma ?? index}`} className="px-5 py-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{a.nome}</p>
                    <p className="text-caption text-neutral-500">{a.turma}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                    {a.percentualPresenca}% {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <AlunosFaltososList
            alunos={alunosEmRisco}
            loading={loadingFreq}
            error={freqError}
            showStats
          />
        )}
      </div>
    </div>
  );
}
