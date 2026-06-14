"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { createProfessor } from "@/lib/api";

export default function ProfessorFormModal({ open, onClose, onSaved }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNome("");
      setEmail("");
      setSenha("");
      setError("");
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createProfessor({ nome, email, senha });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message || "Não foi possível cadastrar o professor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo Professor">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nome completo *" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <Input
          label="E-mail institucional *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="professor@engnet.com"
          required
        />
        <Input
          label="Senha inicial *"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          required
        />

        {error && (
          <p className="text-xs text-error bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold rounded-lg text-sm transition-all"
          >
            {loading ? "Salvando..." : "Cadastrar professor"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
