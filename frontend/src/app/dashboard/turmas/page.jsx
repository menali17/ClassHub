"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, ChevronRight, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin, isProfessorOrAdmin } from "@/utils/roles";
import { getTurmas, deleteTurma } from "@/lib/api";
import { getFrequencyStatus } from "@/utils/formatters";
import TurmaFormModal from "@/components/turmas/TurmaFormModal";

// Normaliza turma independente do formato do backend
function normalizeTurma(t) {
  return {
    id: t.id,
    nome: t.nome || t.name || "Sem nome",
    codigo: t.codigo || t.code || t.id || "—",
    horario: t.horario || t.schedule || "—",
    quantidadeAlunos: t.quantidadeAlunos ?? t.totalAlunos ?? t.alunosCount ?? t.alunos?.length ?? 0,
    professor: typeof t.professor === "object"
      ? (t.professor?.nome || t.professor?.name || "")
      : (t.professor || ""),
    professorId: t.professor?.id ?? t.professorId ?? null,
    frequencia: t.percentualPresenca ?? t.frequencia ?? t.frequenciaMedia ?? null,
  };
}

export default function TurmasPage() {
  const { user } = useAuth();
  const [turmas, setTurmas]       = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando]   = useState(null);

  const admin = isAdmin(user);
  const canManage = isProfessorOrAdmin(user);

  function load() {
    setLoading(true);
    setError("");
    getTurmas()
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.turmas || []);
        setTurmas(lista.map(normalizeTurma));
      })
      .catch((err) => {
        setTurmas([]);
        setError(err.message || "Erro ao carregar turmas.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const filtradas = turmas.filter(t =>
    (t.nome || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.codigo || "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id) {
    if (!confirm("Excluir esta turma?")) return;
    try {
      await deleteTurma(id);
      load();
    } catch (err) {
      alert(err.message || "Erro ao excluir turma.");
    }
  }

  function openEdit(t) { setEditando(t); setModalOpen(true); }
  function openNew()  { setEditando(null); setModalOpen(true); }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">
            {admin ? "Gerenciar Turmas" : "Minhas Turmas"}
          </h1>
          <p className="text-caption text-bg-muted mt-1">{filtradas.length} turma(s) encontrada(s)</p>
        </div>
        {canManage && (
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold px-4 py-2.5 rounded-lg text-sm transition-all">
            <Plus size={16} /> Nova turma
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-error bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
      )}

      {/* Busca */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou código..."
          className="w-full sm:max-w-sm rounded-lg border border-bg-border bg-bg-card pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Tabela */}
      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <BookOpen size={40} className="text-neutral-200" />
            <p className="text-neutral-500 text-sm">Nenhuma turma encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-caption text-neutral-500 border-b border-bg-border">
                  <th className="px-5 py-3 font-medium">Turma</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Código</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Horário</th>
                  <th className="px-5 py-3 font-medium">Alunos</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Frequência</th>
                  <th className="px-5 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {filtradas.map((t) => {
                  const st = t.frequencia != null ? getFrequencyStatus(t.frequencia) : null;
                  return (
                    <tr key={t.id} className="hover:bg-bg-light transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium">{t.nome}</p>
                        {t.professor && <p className="text-caption text-neutral-500">{t.professor}</p>}
                      </td>
                      <td className="px-5 py-3 text-neutral-500 hidden md:table-cell">{t.codigo}</td>
                      <td className="px-5 py-3 text-neutral-500 hidden sm:table-cell">{t.horario}</td>
                      <td className="px-5 py-3 text-neutral-500">{t.quantidadeAlunos}</td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        {st ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                            {t.frequencia}%
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">Sem registros</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/dashboard/turmas/${t.id}`}
                            aria-label={`Visualizar turma ${t.nome}`}
                            title="Visualizar turma"
                            className="p-1.5 rounded-lg hover:bg-bg-light text-neutral-500 hover:text-orange-500 transition-colors"
                          >
                            <ChevronRight size={16} />
                          </Link>
                          {canManage && (
                            <>
                              <button
                                onClick={() => openEdit(t)}
                                aria-label={`Editar turma ${t.nome}`}
                                title="Editar turma"
                                className="p-1.5 rounded-lg hover:bg-bg-light text-neutral-500 hover:text-orange-500 transition-colors"
                              >
                                <Pencil size={16} />
                              </button>
                              {admin && (
                                <button
                                  onClick={() => handleDelete(t.id)}
                                  aria-label={`Excluir turma ${t.nome}`}
                                  title="Excluir turma"
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-error transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TurmaFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        turma={editando}
        canAssignProfessor={admin}
        onSaved={load}
      />
    </div>
  );
}
