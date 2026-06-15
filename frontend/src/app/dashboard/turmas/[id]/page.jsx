"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, Users, Search, UserPlus, Trash2 } from "lucide-react";
import { getTurmaAlunos, getAlunos, vincularAluno, desvincularAluno } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { isProfessorOrAdmin } from "@/utils/roles";

export default function TurmaDetalhePage() {
  const { id }   = useParams();
  const { user } = useAuth();
  const [turma,         setTurma]         = useState(null);
  const [alunos,        setAlunos]        = useState([]);
  const [search,        setSearch]        = useState("");
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [vinculoOpen,   setVinculoOpen]   = useState(false);
  const [todosAlunos,   setTodosAlunos]   = useState([]);
  const [alunoSel,      setAlunoSel]      = useState("");
  const [vinculando,    setVinculando]    = useState(false);
  const [vinculoError,  setVinculoError]  = useState("");

  const canManage = isProfessorOrAdmin(user);

  function load() {
    setLoading(true);
    setError("");
    getTurmaAlunos(id)
      .then(data => {
        setTurma(data.turma ?? null);
        setAlunos(data.alunos ?? []);
      })
      .catch((err) => {
        setTurma(null);
        setAlunos([]);
        setError(err.message || "Erro ao carregar turma.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function openVinculo() {
    setVinculoError("");
    setAlunoSel("");
    try {
      const data = await getAlunos();
      setTodosAlunos(Array.isArray(data) ? data : []);
    } catch (err) {
      setVinculoError(err.message || "Erro ao carregar alunos.");
      setTodosAlunos([]);
    }
    setVinculoOpen(true);
  }

  async function handleVincular() {
    if (!alunoSel) return;
    setVinculando(true);
    setVinculoError("");
    try {
      await vincularAluno(id, Number(alunoSel));
      setVinculoOpen(false);
      load();
    } catch (err) {
      setVinculoError(err.message || "Erro ao vincular aluno.");
    } finally {
      setVinculando(false);
    }
  }

  async function handleDesvincular(aluno) {
    if (!confirm(`Desvincular ${aluno.nome} desta turma?`)) return;

    try {
      await desvincularAluno(id, aluno.id);
      load();
    } catch (err) {
      setError(err.message || "Erro ao desvincular aluno.");
    }
  }

  const alunosFiltrados = alunos.filter(a =>
    (a.nome || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.matricula || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.email || "").toLowerCase().includes(search.toLowerCase())
  );

  // Alunos ainda não vinculados
  const alunosDisponiveis = todosAlunos.filter(a =>
    !alunos.some(al => al.id === a.id)
  );

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/turmas" className="text-orange-500 hover:text-orange-400 text-sm font-medium">
          ← Turmas
        </Link>
        <p className="text-sm text-error bg-red-50 border border-red-200 rounded-lg p-4">{error}</p>
      </div>
    );
  }

  if (!turma) return <p className="text-neutral-500">Turma não encontrada.</p>;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/turmas" className="text-orange-500 hover:text-orange-400">Turmas</Link>
        <span className="text-neutral-500">/</span>
        <span className="text-neutral-700 font-medium">{turma.nome}</span>
      </div>

      {/* Card da turma */}
      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-h2 font-bold text-neutral-900">{turma.nome}</h1>
            <p className="text-caption text-neutral-500 mt-1">{turma.codigo} · {turma.horario}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-bg-light rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-neutral-900">{alunos.length}</p>
            <p className="text-caption text-neutral-500">Alunos</p>
          </div>
          <div className="bg-bg-light rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-neutral-700">{turma.horario || "—"}</p>
            <p className="text-caption text-neutral-500">Horário</p>
          </div>
          <div className="bg-bg-light rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-neutral-700">{turma.codigo || "—"}</p>
            <p className="text-caption text-neutral-500">Código</p>
          </div>
        </div>
      </div>

      {/* Lista de alunos */}
      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-bg-border">
          <h3 className="text-h4 font-semibold flex items-center gap-2">
            <Users size={18} className="text-orange-500" />
            Alunos ({alunos.length})
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome, matrícula ou e-mail"
                className="pl-8 pr-4 py-1.5 rounded-lg border border-bg-border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-bg-light"
              />
            </div>
            {canManage && (
              <button
                onClick={openVinculo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-lg text-xs transition-all"
              >
                <UserPlus size={14} /> Vincular aluno
              </button>
            )}
          </div>
        </div>
        <div className="divide-y divide-bg-border">
          {alunosFiltrados.length === 0 ? (
            <p className="text-center py-10 text-neutral-500 text-sm">Nenhum aluno encontrado.</p>
          ) : alunosFiltrados.map((a) => (
            // contrato: { id, nome, email, matricula, fotoUrl }
            <div key={a.id} className="px-5 py-3 flex items-center gap-3">
              <Avatar name={a.nome} fotoUrl={a.fotoUrl} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{a.nome}</p>
                <p className="text-caption text-neutral-500">{a.matricula} · {a.email}</p>
              </div>
              {canManage && (
                <button
                  type="button"
                  onClick={() => handleDesvincular(a)}
                  aria-label={`Desvincular ${a.nome} da turma`}
                  className="p-2 rounded-lg text-neutral-500 hover:text-error hover:bg-red-50"
                  title="Desvincular aluno"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal vincular aluno */}
      <Modal open={vinculoOpen} onClose={() => setVinculoOpen(false)} title="Vincular Aluno à Turma">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Selecionar aluno</label>
            <select
              value={alunoSel}
              onChange={e => setAlunoSel(e.target.value)}
              className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">— selecione —</option>
              {alunosDisponiveis.map(a => (
                <option key={a.id} value={a.id}>{a.nome} · {a.matricula}</option>
              ))}
            </select>
          </div>
          {vinculoError && (
            <p className="text-xs text-error bg-red-50 border border-red-200 rounded-lg p-3">{vinculoError}</p>
          )}
          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={() => setVinculoOpen(false)} className="px-4 py-2.5 border border-neutral-200 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleVincular}
              disabled={!alunoSel || vinculando}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold rounded-lg text-sm transition-all"
            >
              {vinculando ? "Vinculando..." : "Vincular"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
