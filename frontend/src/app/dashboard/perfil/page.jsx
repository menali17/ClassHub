"use client";
import { useState } from "react";
import { Camera, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updatePerfil, updateSenha } from "@/lib/api";
import { getPerfilLabel } from "@/utils/roles";
import Avatar from "@/components/ui/Avatar";

export default function PerfilPage() {
  const { user } = useAuth();

  const [nome,      setNome]      = useState(user?.nome || "");
  const [telefone,  setTelefone]  = useState(user?.telefone || "");
  const [depto,     setDepto]     = useState(user?.departamento || "");
  const [saving,    setSaving]    = useState(false);
  const [saveMsg,   setSaveMsg]   = useState("");

  const [senhaAtual,    setSenhaAtual]    = useState("");
  const [novaSenha,     setNovaSenha]     = useState("");
  const [confirmSenha,  setConfirmSenha]  = useState("");
  const [changingPass,  setChangingPass]  = useState(false);
  const [passMsg,       setPassMsg]       = useState("");
  const [passError,     setPassError]     = useState("");

  async function handleSavePerfil(e) {
    e.preventDefault();
    setSaving(true); setSaveMsg("");
    try {
      await updatePerfil({ nome, telefone, departamento: depto });
      setSaveMsg("Perfil atualizado com sucesso!");
    } catch (err) {
      setSaveMsg(err.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSenha(e) {
    e.preventDefault();
    setPassError(""); setPassMsg("");
    if (novaSenha !== confirmSenha) { setPassError("As senhas não coincidem."); return; }
    setChangingPass(true);
    try {
      await updateSenha({ senhaAtual, novaSenha });
      setPassMsg("Senha alterada com sucesso!");
      setSenhaAtual(""); setNovaSenha(""); setConfirmSenha("");
    } catch (err) {
      setPassError(err.message || "Erro ao alterar senha.");
    } finally {
      setChangingPass(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl w-full mx-auto">
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Meu Perfil</h1>
        <p className="text-caption text-bg-muted mt-1">Gerencie suas informações pessoais</p>
      </div>

      {/* Card foto */}
      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar name={user?.nome} fotoUrl={user?.fotoUrl} size="lg" />
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-400 transition-colors">
            <Camera size={14} color="black" />
          </button>
        </div>
        <div className="text-center">
          <p className="font-semibold text-neutral-900">{user?.nome}</p>
          <p className="text-caption text-neutral-500">{user?.email}</p>
          <span className="inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">{getPerfilLabel(user?.perfil)}</span>
        </div>
      </div>

      {/* Informações pessoais */}
      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card p-6">
        <h3 className="text-h4 font-semibold mb-5">Informações Pessoais</h3>
        <form onSubmit={handleSavePerfil} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Nome completo</label>
            <input value={nome} onChange={e => setNome(e.target.value)}
              className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">E-mail institucional</label>
            <input value={user?.email || ""} readOnly
              className="w-full rounded-lg border border-bg-border bg-bg-light px-4 py-2.5 text-sm text-neutral-500 cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Telefone</label>
            <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 00000-0000"
              className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Departamento</label>
            <input value={depto} onChange={e => setDepto(e.target.value)} placeholder="Ex: Ciências Exatas"
              className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {saveMsg && <p className="text-sm text-success bg-green-50 border border-green-200 rounded-lg p-3">{saveMsg}</p>}
          <button type="submit" disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold py-2.5 rounded-lg text-sm transition-all">
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </div>

      {/* Alterar senha */}
      <div className="bg-bg-card rounded-xl border border-bg-border shadow-card p-6">
        <h3 className="text-h4 font-semibold mb-5">Alterar Senha</h3>
        <form onSubmit={handleSenha} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Senha atual</label>
            <input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} required
              className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Nova senha</label>
            <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} required
              className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Confirmar nova senha</label>
            <input type="password" value={confirmSenha} onChange={e => setConfirmSenha(e.target.value)} required
              className="w-full rounded-lg border border-bg-border bg-bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {passError && <p className="text-sm text-error bg-red-50 border border-red-200 rounded-lg p-3">{passError}</p>}
          {passMsg   && <p className="text-sm text-success bg-green-50 border border-green-200 rounded-lg p-3">{passMsg}</p>}
          <button type="submit" disabled={changingPass}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold py-2.5 rounded-lg text-sm transition-all">
            {changingPass ? "Alterando..." : "Alterar senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
