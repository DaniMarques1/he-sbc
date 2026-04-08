"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { createClient } from "@/utils/supabase/client";
import { Toast } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/next";

export default function ProfilePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [emebName, setEmebName] = useState("");
  const [emebAddress, setEmebAddress] = useState("");
  const [emebCep, setEmebCep] = useState("");
  const [emebTel1, setEmebTel1] = useState("");
  const [emebTel2, setEmebTel2] = useState("");
  const [emebAtoCriacao, setEmebAtoCriacao] = useState("");
  const [respNome, setRespNome] = useState("");
  const [respMatricula, setRespMatricula] = useState("");
  const [respCargo, setRespCargo] = useState("");

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user?.user_metadata) {
        const meta = data.user.user_metadata;
        // The default fallback values are standard if not defined
        setEmebName(meta.emeb_name || "");
        setEmebAddress(meta.emeb_address || "");
        setEmebCep(meta.emeb_cep || "");
        setEmebTel1(meta.emeb_tel1 || "");
        setEmebTel2(meta.emeb_tel2 || "");
        setEmebAtoCriacao(meta.emeb_ato_criacao || "");
        setRespNome(meta.resp_nome || "");
        setRespMatricula(meta.resp_matricula || "");
        setRespCargo(meta.resp_cargo || "");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setIsPending(true);

    const { data, error } = await supabase.auth.updateUser({
      data: {
        emeb_name: emebName,
        emeb_address: emebAddress,
        emeb_cep: emebCep,
        emeb_tel1: emebTel1,
        emeb_tel2: emebTel2,
        emeb_ato_criacao: emebAtoCriacao,
        resp_nome: respNome,
        resp_matricula: respMatricula,
        resp_cargo: respCargo
      }
    });

    setIsPending(false);

    if (error) {
      window.dispatchEvent(new CustomEvent('show_toast', { detail: "Erro ao atualizar perfil: " + error.message }));
    } else {
      window.dispatchEvent(new CustomEvent('show_toast', { detail: "Perfil atualizado com sucesso!" }));
    }
  };

  return (
    <>
      <Toast />
      <Analytics />
      <Sidebar user={user} />
      <main className="md:ml-64 min-h-screen transition-all duration-300">
        <Header
          isPending={isPending}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <div className="px-4 md:px-10 py-6 md:py-8 max-w-7xl mx-auto space-y-8 md:space-y-10">
          <div className="bg-surface-container-low rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-white px-4 md:px-8 py-4 md:py-8">
              <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                <span className="material-symbols-outlined text-primary text-[28px]" data-icon="manage_accounts">manage_accounts</span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-headline text-primary tracking-wider">Meu Perfil</h2>
                  <p className="text-sm text-secondary mt-1">Configure os dados padrão da sua Unidade Escolar. Eles serão carregados automaticamente ao gerar um novo histórico.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1 md:col-span-3">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nome da EMEB (Padrão)</label>
                  <input
                    type="text"
                    value={emebName}
                    onChange={(e) => setEmebName(e.target.value)}
                    placeholder="EMEB NOME DA ESCOLA"
                    className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none focus:border-primary transition-colors text-lg"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Endereço Completo</label>
                  <input
                    type="text"
                    value={emebAddress}
                    onChange={(e) => setEmebAddress(e.target.value)}
                    placeholder="Rua Exemplo, 123 - Bairro Exemplo - SBC - SP"
                    className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">CEP</label>
                  <input
                    type="text"
                    value={emebCep}
                    onChange={(e) => setEmebCep(e.target.value)}
                    placeholder="09000-000"
                    className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Telefone 1</label>
                  <input
                    type="text"
                    value={emebTel1}
                    onChange={(e) => setEmebTel1(e.target.value)}
                    placeholder="(11) 4000-0000"
                    className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Telefone 2</label>
                  <input
                    type="text"
                    value={emebTel2}
                    onChange={(e) => setEmebTel2(e.target.value)}
                    placeholder="(11) 4000-0001"
                    className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Ato de Criação</label>
                  <input
                    type="text"
                    value={emebAtoCriacao}
                    onChange={(e) => setEmebAtoCriacao(e.target.value)}
                    placeholder="DECRETO nº 99.999 de 01/01/2000"
                    className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1 md:col-span-3 mt-4 border-t border-outline-variant/20 pt-6">
                  <h3 className="text-sm font-bold font-headline text-primary mb-2">Informações do(a) Diretor(a) (Assinatura)</h3>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nome</label>
                  <input
                    type="text"
                    value={respNome}
                    onChange={(e) => setRespNome(e.target.value)}
                    placeholder="Nome do Responsável"
                    className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Matrícula</label>
                  <input
                    type="text"
                    value={respMatricula}
                    onChange={(e) => setRespMatricula(e.target.value)}
                    placeholder="Ex: 12.345-6"
                    className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Cargo</label>
                  <select
                    value={respCargo || "Diretor(a) Escolar"}
                    onChange={(e) => setRespCargo(e.target.value)}
                    className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="Diretor(a) Escolar">Diretor(a) Escolar</option>
                    <option value="Professor(a) Substituindo Direção">Professor(a) Substituindo Direção</option>
                  </select>
                </div>

                <div className="md:col-span-3 flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="bg-gradient-to-br from-primary to-primary-container text-white px-10 py-3 rounded-xl font-manrope font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm" data-icon="save">save</span>
                    {isPending ? "Salvando..." : "Salvar Configurações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
