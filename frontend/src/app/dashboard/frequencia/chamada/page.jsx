"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import { getTurmas, getTurmaAlunos, createAula, saveFrequencias } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";

function getLocalDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function ChamadaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ChamadaContent />
    </Suspense>
  );
}

function ChamadaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedClassId = searchParams.get("turmaId");
  const [turmas, setTurmas] = useState([]);
  const [turmaSel, setTurmaSel] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [frequencias, setFrequencias] = useState([]);
  const [data, setData] = useState(getLocalDate);
  const [horario, setHorario] = useState("19:00");
  const [loading, setLoading] = useState(false);
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getTurmas()
      .then((t) => {
        const lista = Array.isArray(t) ? t : [];
        setTurmas(lista);
        const selectedClass = lista.find((item) => String(item.id) === requestedClassId);
        if (lista.length > 0) setTurmaSel(String(selectedClass?.id ?? lista[0].id));
      })
      .catch((err) => setError(err.message || "Erro ao carregar turmas."))
      .finally(() => setLoadingTurmas(false));
  }, [requestedClassId]);

  useEffect(() => {
    if (!turmaSel) return;
    setLoadingAlunos(true);
    setError("");
    getTurmaAlunos(turmaSel)
      .then((res) => {
        const lista = res.alunos ?? [];
        setAlunos(lista);
        setFrequencias(lista.map((a) => ({ alunoId: a.id, situacao: "presente" })));
      })
      .catch((err) => {
        setAlunos([]);
        setFrequencias([]);
        setError(err.message || "Erro ao carregar alunos da turma.");
      })
      .finally(() => setLoadingAlunos(false));
  }, [turmaSel]);

  function toggleAluno(alunoId, situacao) {
    setFrequencias((prev) =>
      prev.map((f) => (f.alunoId === alunoId ? { ...f, situacao } : f)),
    );
  }

  function marcarTodos(situacao) {
    setFrequencias((prev) => prev.map((f) => ({ ...f, situacao })));
  }

  async function handleConfirmar() {
    setError("");
    setLoading(true);
    try {
      const aula = await createAula(turmaSel, { data, horario });
      await saveFrequencias(aula.id, frequencias);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/frequencia"), 2000);
    } catch (err) {
      setError(err.message || "Erro ao salvar chamada.");
    } finally {
      setLoading(false);
    }
  }

  const totalPresentes = frequencias.filter((f) => f.situacao === "presente").length;

  if (success) {
    return (
      <RoleGuard allowed={["professor"]}>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-success" />
          </div>
          <h2 className="text-h3 font-semibold text-neutral-900">Chamada confirmada!</h2>
          <p className="text-neutral-500 text-sm">Redirecionando...</p>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowed={["professor"]}>
      <div className="space-y-6 max-w-2xl w-full mx-auto">
        <Link
          href="/dashboard/frequencia"
          className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-400 text-sm font-medium"
        >
          ← Frequência
        </Link>

        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Registrar Chamada</h1>
          <p className="text-caption text-bg-muted mt-1">
            Todos os alunos iniciam como presentes — ajuste apenas as faltas e confirme.
          </p>
        </div>

        <div className="bg-bg-card rounded-xl border border-bg-border shadow-card p-5 space-y-4">
          <h3 className="text-h4 font-semibold">Dados da aula</h3>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Turma *</label>
            <select
              value={turmaSel}
              onChange={(e) => setTurmaSel(e.target.value)}
              disabled={loadingTurmas || turmas.length === 0}
              className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">Data *</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
                className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">Horário *</label>
              <input
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                required
                className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-bg-card rounded-xl border border-bg-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-bg-border">
            <h3 className="text-h4 font-semibold">Chamada digital ({alunos.length} alunos)</h3>
            <span className="text-sm text-neutral-500">{totalPresentes} presentes</span>
          </div>

          <div className="flex gap-3 px-5 py-3 border-b border-bg-border">
            <button
              type="button"
              onClick={() => marcarTodos("presente")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-semibold transition-colors"
            >
              ✓ Todos presentes
            </button>
            <button
              type="button"
              onClick={() => marcarTodos("falta")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-error hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
            >
              ✗ Todos ausentes
            </button>
          </div>

          {loadingAlunos ? (
            <div className="flex justify-center py-10">
              <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-bg-border">
              {alunos.map((a) => {
                const fq = frequencias.find((f) => f.alunoId === a.id);
                const presente = fq?.situacao === "presente";
                return (
                  <div key={a.id} className="px-5 py-3 flex items-center gap-3">
                    <Avatar name={a.nome} fotoUrl={a.fotoUrl} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{a.nome}</p>
                      <p className="text-caption text-neutral-500">{a.matricula}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleAluno(a.id, "presente")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                          ${presente ? "bg-green-500 text-white" : "border border-neutral-200 text-neutral-500 hover:border-green-300"}`}
                      >
                        Presente
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAluno(a.id, "falta")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                          ${!presente ? "bg-error text-white" : "border border-neutral-200 text-neutral-500 hover:border-red-300"}`}
                      >
                        Falta
                      </button>
                    </div>
                  </div>
                );
              })}
              {alunos.length === 0 && (
                <p className="text-center py-10 text-neutral-500 text-sm">
                  Nenhum aluno vinculado a esta turma.
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-error bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
        )}

        <button
          type="button"
          onClick={handleConfirmar}
          disabled={loading || alunos.length === 0 || loadingTurmas}
          className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold py-3 rounded-lg text-sm transition-all"
        >
          {loading ? "Salvando..." : "Confirmar chamada"}
        </button>
      </div>
    </RoleGuard>
  );
}
