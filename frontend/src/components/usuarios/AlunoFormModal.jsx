"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { createAluno, updateAluno } from "@/lib/api";

export default function AlunoFormModal({ open, onClose, onSaved, usuario = null }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNome(usuario?.nome || "");
      setEmail(usuario?.email || "");
      setMatricula(usuario?.matricula || "");
      setSenha("");
      setTelefone(usuario?.telefone || "");
      setFotoUrl(usuario?.fotoUrl || "");
      setError("");
    }
  }, [open, usuario]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { nome, email, matricula, telefone, fotoUrl };
      if (usuario) await updateAluno(usuario.id, payload);
      else await createAluno({ ...payload, senha });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message || "Não foi possível cadastrar o aluno.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={usuario ? "Editar Aluno" : "Novo Aluno"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nome completo *" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <Input
          label="E-mail institucional *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="aluno@engnet.com"
          required
        />
        <Input
          label="Matrícula *"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          placeholder="20260011"
          required
        />
        {!usuario && (
          <Input
            label="Senha inicial *"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
          />
        )}
        <Input label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" />
        <Input label="URL da foto" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} placeholder="https://exemplo.com/foto.jpg" />

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
            {loading ? "Salvando..." : usuario ? "Salvar alterações" : "Cadastrar aluno"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
