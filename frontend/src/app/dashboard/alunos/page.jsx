"use client";
import { useEffect, useState } from "react";
import { KeyRound, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import AlunoFormModal from "@/components/usuarios/AlunoFormModal";
import { deleteAluno, getAlunos, resetSenhaAluno } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import PasswordResetModal from "@/components/usuarios/PasswordResetModal";

export default function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [redefinindo, setRedefinindo] = useState(null);

  function loadAlunos() {
    setLoading(true);
    setError("");
    getAlunos()
      .then((data) => setAlunos(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Erro ao carregar alunos."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAlunos();
  }, []);

  function openNew() {
    setEditando(null);
    setModalOpen(true);
  }

  function openEdit(aluno) {
    setEditando(aluno);
    setModalOpen(true);
  }

  async function handleDelete(aluno) {
    if (!confirm(`Desativar o aluno ${aluno.nome}?`)) return;

    try {
      await deleteAluno(aluno.id);
      loadAlunos();
    } catch (err) {
      setError(err.message || "Erro ao desativar aluno.");
    }
  }

  const filtrados = alunos.filter(
    (a) =>
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.matricula?.includes(search) ||
      a.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <RoleGuard allowed={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-h2 font-bold text-neutral-900">Alunos</h1>
            <p className="text-caption text-bg-muted mt-1">{filtrados.length} aluno(s) cadastrado(s)</p>
          </div>
          <Button onClick={openNew}>
            <Plus size={16} /> Novo Aluno
          </Button>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, matrícula ou e-mail..."
            className="w-full sm:max-w-sm rounded-lg border border-bg-border bg-bg-card pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {error && (
          <p className="text-sm text-error bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
        )}

        <div className="bg-bg-card rounded-xl border border-bg-border shadow-card overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtrados.length === 0 ? (
            <div className="flex flex-col items-center py-14 gap-3">
              <Users size={40} className="text-neutral-200" />
              <p className="text-neutral-500 text-sm">Nenhum aluno encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-caption text-neutral-500 border-b border-bg-border">
                    <th className="px-5 py-3 font-medium">Aluno</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Matrícula</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">E-mail</th>
                    <th className="px-5 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-border">
                  {filtrados.map((a) => (
                    <tr key={a.id} className="hover:bg-bg-light transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={a.nome} fotoUrl={a.fotoUrl} size="md" />
                          <span className="font-medium">{a.nome}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-neutral-500 hidden md:table-cell">{a.matricula}</td>
                      <td className="px-5 py-3 text-neutral-500 hidden lg:table-cell">{a.email}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => openEdit(a)} className="p-2 rounded-lg text-neutral-500 hover:text-orange-500 hover:bg-bg-light" title="Editar aluno">
                            <Pencil size={16} />
                          </button>
                          <button type="button" onClick={() => setRedefinindo(a)} className="p-2 rounded-lg text-neutral-500 hover:text-orange-500 hover:bg-bg-light" title="Redefinir senha">
                            <KeyRound size={16} />
                          </button>
                          <button type="button" onClick={() => handleDelete(a)} className="p-2 rounded-lg text-neutral-500 hover:text-error hover:bg-red-50" title="Desativar aluno">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AlunoFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={loadAlunos}
          usuario={editando}
        />
        <PasswordResetModal
          open={Boolean(redefinindo)}
          usuario={redefinindo}
          onClose={() => setRedefinindo(null)}
          onReset={resetSenhaAluno}
        />
      </div>
    </RoleGuard>
  );
}
