"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAlunosFaltosos } from "@/hooks/useAlunosFaltosos";
import { getAlunos, getTurmas, getFrequenciaAluno, API_BASE_URL, getAuthToken } from "@/lib/api";
import { fetchFrequenciasAlunos, normalizeAlunosFaltosos } from "@/lib/frequenciaHelpers";
import AlunosFaltososList from "@/components/frequencia/AlunosFaltososList";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import { getFrequencyStatus } from "@/utils/formatters";
import { normalizePerfil } from "@/utils/roles";

export default function RelatoriosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RelatoriosContent />
    </Suspense>
  );
}

function RelatoriosContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const perfil = normalizePerfil(user?.perfil);
  const isAluno = perfil === "aluno";

  const { faltosos, loading: loadingFaltosos, error: faltososError } = useAlunosFaltosos(
    isAluno ? null : user,
  );

  const [aba, setAba] = useState("geral");
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [freqResumo, setFreqResumo] = useState(null);
  const [freqTurmas, setFreqTurmas] = useState([]);
  const [alunosComFreq, setAlunosComFreq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFreqAlunos, setLoadingFreqAlunos] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const tab = searchParams.get("aba");
    if (tab === "faltosos" && !isAluno) setAba("faltosos");
  }, [searchParams, isAluno]);

  useEffect(() => {
    if (isAluno) {
      getFrequenciaAluno("me")
        .then((data) => {
          setFreqResumo(data.resumoGeral ?? null);
          setFreqTurmas(data.turmas ?? []);
        })
        .catch((err) => setError(err.message || "Erro ao carregar relatório."))
        .finally(() => setLoading(false));
      return;
    }

    Promise.all([getAlunos(), getTurmas()])
      .then(([a, t]) => {
        setAlunos(Array.isArray(a) ? a : []);
        setTurmas(Array.isArray(t) ? t : []);
      })
      .catch((err) => setError(err.message || "Erro ao carregar dados."))
      .finally(() => setLoading(false));
  }, [isAluno]);

  useEffect(() => {
    if (isAluno || aba !== "geral" || alunos.length === 0) return;

    let cancelled = false;
    setLoadingFreqAlunos(true);

    fetchFrequenciasAlunos(alunos)
      .then((freqData) => {
        if (cancelled) return;

        setAlunosComFreq(
          freqData.map((f) => ({
            ...f.aluno,
            percentualPresenca: f.resumoGeral?.percentualPresenca ?? 0,
            presencas: f.resumoGeral?.presencas ?? 0,
            faltas: f.resumoGeral?.faltas ?? 0,
            totalAulas: f.resumoGeral?.totalAulas ?? 0,
            baixaFrequencia: f.resumoGeral?.baixaFrequencia ?? false,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setAlunosComFreq(alunos.map((a) => ({ ...a, percentualPresenca: null })));
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingFreqAlunos(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAluno, aba, alunos]);

  const tabs = isAluno
    ? [
        { id: "geral", label: "Resumo Geral" },
        { id: "disciplinas", label: "Por Disciplina" },
      ]
    : [
        { id: "geral", label: "Por Aluno" },
        { id: "faltosos", label: "Alunos Faltosos" },
        { id: "turmas", label: "Por Turma" },
      ];

  const faltososDisplay =
    faltosos.length > 0
      ? normalizeAlunosFaltosos(faltosos)
      : normalizeAlunosFaltosos(alunosComFreq.filter((a) => a.baixaFrequencia));

  async function baixarRelatorio(formato) {
    const token = getAuthToken();

    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    const endpoints = {
      geral: "/relatorios/alunos/exportar",
      faltosos: "/relatorios/alunos-baixa-frequencia/exportar",
      turmas: "/relatorios/turmas/exportar",
    };

    const nomes = {
      geral: "relatorio-geral-alunos",
      faltosos: "alunos-baixa-frequencia",
      turmas: "relatorio-geral-turmas",
    };

    const endpoint = endpoints[aba];

    if (!endpoint) {
      alert("Exportação não disponível para esta aba.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}?formato=${formato}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        alert(error?.message || "Erro ao exportar relatório.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${nomes[aba]}.${formato === "pdf" ? "pdf" : "xlsx"}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Falha de conexão ao exportar relatório.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Relatórios</h1>
          <p className="text-caption text-bg-muted mt-1">Análise detalhada de frequência</p>
        </div>

        {!isAluno && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => baixarRelatorio("pdf")}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-200 rounded-lg text-sm hover:bg-bg-light transition-colors"
            >
              <FileText size={14} /> PDF
            </button>

            <button
              type="button"
              onClick={() => baixarRelatorio("xlsx")}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-200 rounded-lg text-sm hover:bg-bg-light transition-colors"
            >
              <Download size={14} /> Excel
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
      )}

      <div className="flex gap-1 bg-bg-light rounded-xl p-1 w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setAba(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${aba === t.id ? "bg-bg-card shadow-card text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isAluno && aba === "geral" && freqResumo && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total de aulas", value: freqResumo.totalAulas, color: "text-neutral-900" },
            { label: "Presenças", value: freqResumo.presencas, color: "text-success" },
            { label: "Faltas", value: freqResumo.faltas, color: "text-error" },
            {
              label: "Frequência",
              value: `${Math.round(freqResumo.percentualPresenca)}%`,
              color: freqResumo.baixaFrequencia ? "text-error" : "text-success",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-bg-card rounded-xl border border-bg-border shadow-card p-5 text-center"
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-caption text-neutral-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {isAluno && aba === "disciplinas" && (
        <div className="space-y-4">
          {freqTurmas.map((t) => {
            const st = getFrequencyStatus(t.percentualPresenca ?? 0);

            return (
              <div
                key={t.turmaId}
                className="bg-bg-card rounded-xl border border-bg-border shadow-card overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-bg-border">
                  <div>
                    <h3 className="text-h4 font-semibold">{t.nome}</h3>
                    <p className="text-caption text-neutral-500">
                      {t.presencas ?? 0} presenças · {t.faltas ?? 0} faltas ·{" "}
                      {t.totalAulas ?? t.historico?.length ?? 0} aula(s)
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                    {Math.round(t.percentualPresenca ?? 0)}%
                  </span>
                </div>

                {t.historico?.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-caption text-neutral-500 border-b border-bg-border">
                          <th className="px-5 py-3 font-medium">Data</th>
                          <th className="px-5 py-3 font-medium">Horário</th>
                          <th className="px-5 py-3 font-medium">Situação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-bg-border">
                        {t.historico.map((h, i) => (
                          <tr key={h.aulaId ?? i} className="hover:bg-bg-light">
                            <td className="px-5 py-3">{h.data}</td>
                            <td className="px-5 py-3 text-neutral-500">{h.horario ?? "—"}</td>
                            <td className="px-5 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  h.situacao === "presente"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-error"
                                }`}
                              >
                                {h.situacao === "presente" ? "Presente" : "Falta"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {(!t.historico || t.historico.length === 0) && (
                  <p className="text-center py-6 text-neutral-500 text-sm">
                    Nenhuma aula registrada ainda.
                  </p>
                )}
              </div>
            );
          })}

          {freqTurmas.length === 0 && (
            <p className="text-center py-10 text-neutral-500">
              Nenhuma disciplina com aulas registradas.
            </p>
          )}
        </div>
      )}

      {!isAluno && aba === "geral" && (
        <div className="bg-bg-card rounded-xl border border-bg-border shadow-card overflow-hidden">
          {loadingFreqAlunos ? (
            <div className="flex justify-center py-12">
              <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-caption text-neutral-500 border-b border-bg-border">
                    <th className="px-5 py-3 font-medium">Aluno</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Matrícula</th>
                    <th className="px-5 py-3 font-medium">Frequência</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Presenças / Faltas</th>
                    <th className="px-5 py-3 font-medium hidden sm:table-cell">Situação</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-bg-border">
                  {(alunosComFreq.length > 0 ? alunosComFreq : alunos).map((a) => {
                    const pct = a.percentualPresenca;
                    const st = pct != null ? getFrequencyStatus(pct) : null;

                    return (
                      <tr key={a.id} className="hover:bg-bg-light">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={a.nome} size="sm" />
                            <span className="font-medium">{a.nome}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-neutral-500 hidden md:table-cell">{a.matricula}</td>
                        <td className="px-5 py-3">
                          {pct != null ? (
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <ProgressBar value={pct} showMin={false} />
                              <span className="font-semibold">{Math.round(pct)}%</span>
                            </div>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-neutral-500 hidden lg:table-cell">
                          {a.totalAulas != null
                            ? `${a.presencas ?? 0} / ${a.faltas ?? 0} (${a.totalAulas} aulas)`
                            : "—"}
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          {st ? (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                              {st.label}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {alunos.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-neutral-500">
                        Nenhum aluno encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!isAluno && aba === "faltosos" && (
        <div className="bg-bg-card rounded-xl border border-bg-border shadow-card">
          <div className="px-5 py-4 border-b border-bg-border">
            <h3 className="text-h4 font-semibold">Alunos com baixa frequência</h3>
            <p className="text-caption text-neutral-500 mt-1">
              Alunos abaixo do limite mínimo de 75% de presença
            </p>
          </div>

          <AlunosFaltososList
            alunos={faltososDisplay}
            loading={loadingFaltosos}
            error={faltososError}
            showStats
          />
        </div>
      )}

      {!isAluno && aba === "turmas" && (
        <div className="bg-bg-card rounded-xl border border-bg-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-caption text-neutral-500 border-b border-bg-border">
                  <th className="px-5 py-3 font-medium">Turma</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Código</th>
                  <th className="px-5 py-3 font-medium">Alunos</th>
                  <th className="px-5 py-3 font-medium">Frequência</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Horário</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Professor</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-bg-border">
                {turmas.map((t) => {
                  const percentual = t.percentualPresenca;
                  const status = percentual != null ? getFrequencyStatus(percentual) : null;

                  return (
                    <tr key={t.id} className="hover:bg-bg-light">
                      <td className="px-5 py-3 font-medium">{t.nome}</td>
                      <td className="px-5 py-3 text-neutral-500 hidden md:table-cell">{t.codigo}</td>
                      <td className="px-5 py-3 text-neutral-500">{t.quantidadeAlunos ?? "—"}</td>
                      <td className="px-5 py-3">
                        {status ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                            {percentual}%
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">Sem registros</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-neutral-500 hidden sm:table-cell">{t.horario}</td>
                      <td className="px-5 py-3 text-neutral-500 hidden lg:table-cell">
                        {t.professor?.nome ?? "—"}
                      </td>
                    </tr>
                  );
                })}

                {turmas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-neutral-500">
                      Nenhuma turma encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
