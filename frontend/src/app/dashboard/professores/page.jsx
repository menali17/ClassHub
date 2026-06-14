"use client";
import { useEffect, useState } from "react";
import { Plus, Search, UserCog } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import ProfessorFormModal from "@/components/usuarios/ProfessorFormModal";
import { getProfessores } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  function loadProfessores() {
    setLoading(true);
    setError("");
    getProfessores()
      .then((data) => setProfessores(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Erro ao carregar professores."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProfessores();
  }, []);

  const filtrados = professores.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <RoleGuard allowed={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-h2 font-bold text-neutral-900">Professores</h1>
            <p className="text-caption text-bg-muted mt-1">
              {filtrados.length} professor(es) cadastrado(s)
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Novo Professor
          </Button>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
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
              <UserCog size={40} className="text-neutral-200" />
              <p className="text-neutral-500 text-sm">Nenhum professor encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-caption text-neutral-500 border-b border-bg-border">
                    <th className="px-5 py-3 font-medium">Professor</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">E-mail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-border">
                  {filtrados.map((p) => (
                    <tr key={p.id} className="hover:bg-bg-light transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.nome} size="md" />
                          <span className="font-medium">{p.nome}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-neutral-500 hidden md:table-cell">{p.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ProfessorFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={loadProfessores}
        />
      </div>
    </RoleGuard>
  );
}
