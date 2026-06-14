"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { createTurma, updateTurma, getProfessores } from "@/lib/api";

export default function TurmaFormModal({ open, onClose, turma, onSaved }) {
  const [nome,        setNome]        = useState("");
  const [codigo,      setCodigo]      = useState("");
  const [horario,     setHorario]     = useState("");
  const [professorId, setProfessorId] = useState("");
  const [professores, setProfessores] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => {
    if (turma) {
      setNome(turma.nome || "");
      setCodigo(turma.codigo || "");
      setHorario(turma.horario || "");
      setProfessorId(turma.professorId ? String(turma.professorId) : "");
    } else {
      setNome("");
      setCodigo("");
      setHorario("");
      setProfessorId("");
    }
    setError("");
  }, [turma, open]);

  useEffect(() => {
    if (!open) return;
    getProfessores()
      .then((data) => setProfessores(Array.isArray(data) ? data : []))
      .catch(() => setProfessores([]));
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { nome, codigo, horario };
      if (professorId) payload.professorId = Number(professorId);

      if (turma) {
        await updateTurma(turma.id, payload);
      } else {
        await createTurma(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={turma ? "Editar Turma" : "Nova Turma"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Nome da turma *</label>
          <input
            value={nome} onChange={e => setNome(e.target.value)}
            placeholder="Ex: Química Experimental A"
            required
            className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Código *</label>
          <input
            value={codigo} onChange={e => setCodigo(e.target.value)}
            placeholder="Ex: QUI-2024-A"
            required
            className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Horário *</label>
          <input
            value={horario} onChange={e => setHorario(e.target.value)}
            placeholder="Ex: Seg/Qua 08:00–10:00"
            required
            className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">
            Professor responsável {!turma ? "*" : ""}
          </label>
          <select
            value={professorId}
            onChange={(e) => setProfessorId(e.target.value)}
            required={!turma}
            className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">— selecione —</option>
            {professores.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          {professores.length === 0 && (
            <p className="text-xs text-neutral-500">Cadastre professores antes de criar turmas.</p>
          )}
        </div>

        {error && <p className="text-xs text-error bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold rounded-lg text-sm transition-all">
            {loading ? "Salvando..." : turma ? "Salvar alterações" : "Criar turma"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
