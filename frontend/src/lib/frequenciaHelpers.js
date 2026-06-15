import { getFrequenciaAluno, getTurmaAlunos } from "@/lib/api";

/** Busca frequência de cada aluno em paralelo. */
export async function fetchFrequenciasAlunos(alunos) {
  if (!alunos?.length) return [];

  const settled = await Promise.allSettled(
    alunos.map(async (aluno) => {
      const data = await getFrequenciaAluno(aluno.id);
      return { aluno, ...data };
    }),
  );

  return settled.filter((r) => r.status === "fulfilled").map((r) => r.value);
}

/** Alunos com baixa frequência (< limite do backend). */
export function extractAlunosFaltosos(frequencias) {
  return normalizeAlunosFaltosos(frequencias
    .filter((f) => f.resumoGeral?.baixaFrequencia)
    .map((f) => {
      const turmaCritica =
        f.turmas?.find((t) => t.baixaFrequencia) ||
        [...(f.turmas ?? [])].sort(
          (a, b) => (a.percentualPresenca ?? 0) - (b.percentualPresenca ?? 0),
        )[0];

      return {
        id: f.aluno?.id ?? f.alunoId,
        nome: f.aluno?.nome ?? f.nome,
        matricula: f.aluno?.matricula ?? f.matricula,
        turma: turmaCritica?.nome ?? "—",
        percentualPresenca: f.resumoGeral.percentualPresenca,
        presencas: f.resumoGeral.presencas,
        faltas: f.resumoGeral.faltas,
        totalAulas: f.resumoGeral.totalAulas,
      };
    })
    .sort((a, b) => a.percentualPresenca - b.percentualPresenca));
}

function getTurmaLabel(turma) {
  if (!turma) return "";
  if (typeof turma === "string") return turma;
  return turma.nome ?? "";
}

export function normalizeAlunosFaltosos(alunos) {
  if (!Array.isArray(alunos)) return [];

  const byAluno = new Map();

  for (const aluno of alunos) {
    const key = aluno.id ?? aluno.alunoId ?? aluno.matricula ?? aluno.email;

    if (key == null) {
      byAluno.set(Symbol(), aluno);
      continue;
    }

    const current = byAluno.get(key);
    if (!current) {
      byAluno.set(key, { ...aluno });
      continue;
    }

    const currentPct = current.percentualPresenca ?? Number.POSITIVE_INFINITY;
    const nextPct = aluno.percentualPresenca ?? Number.POSITIVE_INFINITY;
    const base = nextPct < currentPct ? { ...current, ...aluno } : current;
    const turmas = new Set([getTurmaLabel(current.turma), getTurmaLabel(aluno.turma)].filter(Boolean));

    byAluno.set(key, {
      ...base,
      turma: turmas.size > 0 ? Array.from(turmas).join(", ") : base.turma,
    });
  }

  return Array.from(byAluno.values()).sort(
    (a, b) => (a.percentualPresenca ?? 0) - (b.percentualPresenca ?? 0),
  );
}

export function calcTaxaMediaPresenca(frequencias) {
  const valid = frequencias.filter((f) => (f.resumoGeral?.totalAulas ?? 0) > 0);
  if (valid.length === 0) return null;
  const sum = valid.reduce((acc, f) => acc + (f.resumoGeral?.percentualPresenca ?? 0), 0);
  return Math.round((sum / valid.length) * 10) / 10;
}

/** Agrega percentual médio por turma a partir dos históricos dos alunos. */
export function aggregateFrequenciaPorTurma(frequencias) {
  const map = new Map();

  for (const f of frequencias) {
    for (const t of f.turmas ?? []) {
      if (!(t.totalAulas > 0)) continue;
      const key = t.turmaId ?? t.nome;
      if (!map.has(key)) {
        map.set(key, {
          codigo: t.codigo ?? t.nome?.slice(0, 12) ?? "—",
          disciplina: t.nome,
          total: 0,
          count: 0,
        });
      }
      const entry = map.get(key);
      entry.total += t.percentualPresenca ?? 0;
      entry.count += 1;
    }
  }

  return Array.from(map.values()).map((e) => ({
    codigo: e.codigo,
    disciplina: e.disciplina,
    frequencia: Math.round(e.total / e.count),
  }));
}

/** Coleta alunos únicos vinculados às turmas informadas. */
export async function fetchAlunosDasTurmas(turmas) {
  if (!turmas?.length) return [];

  const settled = await Promise.allSettled(
    turmas.map((t) => getTurmaAlunos(t.id).then((res) => res.alunos ?? [])),
  );

  const map = new Map();
  for (const result of settled) {
    if (result.status !== "fulfilled") continue;
    for (const aluno of result.value) {
      map.set(aluno.id, aluno);
    }
  }
  return Array.from(map.values());
}
