"use client";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import { getFrequencyStatus } from "@/utils/formatters";

function getAlunoKey(aluno, index) {
  const id = aluno.id ?? aluno.alunoId ?? aluno.matricula ?? aluno.email ?? aluno.nome ?? "aluno";
  const turma = aluno.turmaId ?? aluno.turma?.id ?? aluno.turma ?? "sem-turma";
  return `${id}-${turma}-${index}`;
}

export default function AlunosFaltososList({
  alunos = [],
  loading = false,
  error = "",
  emptyMessage = "Nenhum aluno com baixa frequência.",
  showStats = false,
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center py-8 text-error text-sm bg-red-50 border border-red-200 rounded-lg mx-5 my-4">
        {error}
      </p>
    );
  }

  if (alunos.length === 0) {
    return (
      <p className="text-center py-8 text-neutral-500 text-sm">{emptyMessage}</p>
    );
  }

  return (
    <div className="divide-y divide-bg-border">
      {alunos.map((a, index) => {
        const st = getFrequencyStatus(a.percentualPresenca ?? 0);
        return (
          <div key={getAlunoKey(a, index)} className="px-5 py-4 flex items-center gap-4">
            <Avatar name={a.nome} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{a.nome}</p>
              <p className="text-caption text-neutral-500">
                {a.matricula && `${a.matricula} · `}
                {typeof a.turma === "string" ? a.turma : a.turma?.nome ?? "—"}
              </p>
              {showStats && (
                <p className="text-caption text-neutral-400 mt-0.5">
                  {a.presencas ?? 0} presenças · {a.faltas ?? 0} faltas · {a.totalAulas ?? 0} aulas
                </p>
              )}
            </div>
            <div className="w-28 hidden sm:block">
              <ProgressBar value={a.percentualPresenca ?? 0} showMin={false} />
            </div>
            <span className={`text-sm font-bold ml-2 ${st.text}`}>
              {Math.round(a.percentualPresenca ?? 0)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
