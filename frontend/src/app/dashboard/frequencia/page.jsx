"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import { getTurmas, getTurmaAulas } from "@/lib/api";
import { formatDate } from "@/utils/formatters";
import { useAuth } from "@/contexts/AuthContext";
import { isProfessor } from "@/utils/roles";

function statusLabel(status) {
  if (status === "finalizada") return { text: "Finalizada", className: "bg-green-100 text-green-700" };
  if (status === "aberta") return { text: "Aberta", className: "bg-orange-100 text-orange-600" };
  return { text: status ?? "—", className: "bg-neutral-100 text-neutral-600" };
}

export default function FrequenciaPage() {
  const { user } = useAuth();
  const canRegister = isProfessor(user);
  const [turmas, setTurmas] = useState([]);
  const [turmaSel, setTurmaSel] = useState("");
  const [aulas, setAulas] = useState([]);
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [loadingAulas, setLoadingAulas] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getTurmas()
      .then((data) => {
        const lista = Array.isArray(data) ? data : [];
        setTurmas(lista);
        if (lista.length > 0) setTurmaSel(String(lista[0].id));
      })
      .catch((err) => setError(err.message || "Erro ao carregar turmas."))
      .finally(() => setLoadingTurmas(false));
  }, []);

  useEffect(() => {
    if (!turmaSel) {
      setAulas([]);
      return;
    }

    setLoadingAulas(true);
    setError("");
    getTurmaAulas(turmaSel)
      .then((res) => setAulas(res.aulas ?? []))
      .catch((err) => {
        setAulas([]);
        setError(err.message || "Erro ao carregar aulas.");
      })
      .finally(() => setLoadingAulas(false));
  }, [turmaSel]);

  return (
    <RoleGuard allowed={["admin", "professor"]}>
      <div className="space-y-6 max-w-4xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-h2 font-bold text-neutral-900">Controle de Frequência</h1>
            <p className="text-caption text-bg-muted mt-1">Gerencie as chamadas das suas turmas</p>
          </div>
          {canRegister && (
            <Link
              href={`/dashboard/frequencia/chamada${turmaSel ? `?turmaId=${turmaSel}` : ""}`}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold px-4 py-2.5 rounded-lg text-sm transition-all"
            >
              <Plus size={16} /> Nova chamada
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Selecionar turma</label>
          <select
            value={turmaSel}
            onChange={(e) => setTurmaSel(e.target.value)}
            disabled={loadingTurmas || turmas.length === 0}
            className="w-full sm:max-w-xs rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-error bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
        )}

        <div className="bg-bg-card rounded-xl border border-bg-border shadow-card overflow-hidden">
          {loadingTurmas || loadingAulas ? (
            <div className="flex justify-center py-12">
              <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : aulas.length === 0 ? (
            <div className="flex flex-col items-center py-14 gap-3">
              <ClipboardList size={40} className="text-neutral-200" />
              <p className="text-neutral-500 text-sm">Nenhuma aula registrada para esta turma.</p>
              {canRegister && (
                <Link
                  href={`/dashboard/frequencia/chamada?turmaId=${turmaSel}`}
                  className="text-sm text-orange-500 hover:text-orange-400 font-medium"
                >
                  Registrar primeira chamada →
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-caption text-neutral-500 border-b border-bg-border">
                    <th className="px-5 py-3 font-medium">Data</th>
                    <th className="px-5 py-3 font-medium">Horário</th>
                    <th className="px-5 py-3 font-medium hidden sm:table-cell">Registros</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-border">
                  {aulas.map((a) => {
                    const st = statusLabel(a.status);
                    return (
                      <tr key={a.id} className="hover:bg-bg-light transition-colors">
                        <td className="px-5 py-3 font-medium">{formatDate(a.data)}</td>
                        <td className="px-5 py-3 text-neutral-500">{a.horario ?? "—"}</td>
                        <td className="px-5 py-3 text-neutral-500 hidden sm:table-cell">
                          {a.frequenciasRegistradas != null
                            ? `${a.frequenciasRegistradas} aluno(s)`
                            : "—"}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${st.className}`}>
                            {st.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
