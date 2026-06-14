"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { getFrequenciaAluno } from "@/lib/api";
import { getFrequencyStatus } from "@/utils/formatters";
import ProgressBar from "@/components/ui/ProgressBar";

function FrequencyCircle({ percent }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, percent) / 100) * c;
  const color = percent >= 85 ? "#16a34a" : percent >= 75 ? "#d97706" : "#dc2626";
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#e4e4e9" strokeWidth="10" />
        <circle
          cx="72"
          cy="72"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="text-center">
        <p className="text-2xl font-bold" style={{ color }}>{Math.round(percent)}%</p>
        <p className="text-caption text-neutral-500">frequência</p>
      </div>
    </div>
  );
}

export default function AlunoDashboard() {
  const [resumo, setResumo] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFrequenciaAluno("me")
      .then((data) => {
        setResumo(data.resumoGeral ?? null);
        setTurmas(data.turmas ?? []);
      })
      .catch((err) => setError(err.message || "Erro ao carregar sua frequência."))
      .finally(() => setLoading(false));
  }, []);

  const pct = resumo?.percentualPresenca ?? 0;
  const isRisco = resumo?.baixaFrequencia ?? pct < 75;
  const meta = 75;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-h2 font-bold text-neutral-900">Minha Frequência</h1>
        <p className="text-sm text-error bg-red-50 border border-red-200 rounded-lg p-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Minha Frequência</h1>
        <p className="text-caption text-bg-muted mt-1">Acompanhe sua presença nas disciplinas</p>
      </div>

      <div
        className={`rounded-xl p-4 flex items-center gap-3 ${
          isRisco ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"
        }`}
      >
        {isRisco ? (
          <AlertTriangle size={20} className="text-error flex-shrink-0" />
        ) : (
          <CheckCircle2 size={20} className="text-success flex-shrink-0" />
        )}
        <div>
          <p className={`font-semibold text-sm ${isRisco ? "text-error" : "text-success"}`}>
            {isRisco ? "Atenção: frequência abaixo do mínimo!" : "Situação Regular — continue assim!"}
          </p>
          <p className="text-caption text-neutral-500">
            {isRisco
              ? `Sua frequência está em ${Math.round(pct)}%, abaixo do mínimo de ${meta}%.`
              : `Sua frequência está em ${Math.round(pct)}%, acima do mínimo de ${meta}%.`}
          </p>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <FrequencyCircle percent={pct} />
          <div className="grid grid-cols-2 gap-4 flex-1 w-full">
            <div className="text-center p-4 bg-bg-light rounded-xl">
              <p className="text-2xl font-bold text-success">{resumo?.presencas ?? 0}</p>
              <p className="text-caption text-neutral-500 mt-1">Presenças</p>
            </div>
            <div className="text-center p-4 bg-bg-light rounded-xl">
              <p className="text-2xl font-bold text-error">{resumo?.faltas ?? 0}</p>
              <p className="text-caption text-neutral-500 mt-1">Faltas</p>
            </div>
            <div className="text-center p-4 bg-bg-light rounded-xl">
              <p className="text-2xl font-bold text-neutral-900">{resumo?.totalAulas ?? 0}</p>
              <p className="text-caption text-neutral-500 mt-1">Total de aulas</p>
            </div>
            <div className="text-center p-4 bg-bg-light rounded-xl">
              <p className="text-2xl font-bold text-orange-500">{meta}%</p>
              <p className="text-caption text-neutral-500 mt-1">Mínimo exigido</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-bg-border">
          <h3 className="text-h4 font-semibold">Frequência por Disciplina</h3>
          <Link href="/dashboard/relatorios" className="text-sm text-orange-500 hover:text-orange-400 font-medium">
            Ver detalhes
          </Link>
        </div>
        <div className="divide-y divide-bg-border">
          {turmas.map((t) => {
            const tst = getFrequencyStatus(t.percentualPresenca ?? 0);
            return (
              <div key={t.turmaId} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{t.nome}</p>
                    {t.historico?.length > 0 && (
                      <p className="text-caption text-neutral-500">
                        {t.historico.length} aula(s) registrada(s)
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tst.bg} ${tst.text}`}>
                    {Math.round(t.percentualPresenca ?? 0)}%
                  </span>
                </div>
                <ProgressBar value={t.percentualPresenca ?? 0} showMin={false} />
              </div>
            );
          })}
          {turmas.length === 0 && (
            <p className="px-5 py-8 text-center text-neutral-500 text-sm">
              Nenhuma disciplina com aulas registradas ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
