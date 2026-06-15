"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";

export default function PasswordResetModal({ open, onClose, usuario, onReset }) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNovaSenha("");
      setConfirmacao("");
      setError("");
    }
  }, [open]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (novaSenha !== confirmacao) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onReset(usuario.id, novaSenha);
      onClose();
    } catch (err) {
      setError(err.message || "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Redefinir senha de ${usuario?.nome || "usuário"}`} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nova senha"
          type="password"
          value={novaSenha}
          onChange={(event) => setNovaSenha(event.target.value)}
          minLength={6}
          required
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          value={confirmacao}
          onChange={(event) => setConfirmacao(event.target.value)}
          minLength={6}
          required
        />
        {error && <p className="text-xs text-error bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2.5 border border-neutral-200 rounded-lg text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold rounded-lg text-sm">
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
