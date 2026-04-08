"use client";

import { useState, useEffect } from "react";

export function DadosUnidadeEscolar({ user }: { user?: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [emebName, setEmebName] = useState("");
  const [emebAddress, setEmebAddress] = useState("");
  const [emebCep, setEmebCep] = useState("");
  const [emebTel1, setEmebTel1] = useState("");
  const [emebTel2, setEmebTel2] = useState("");
  const [emebAtoCriacao, setEmebAtoCriacao] = useState("");

  useEffect(() => {
    if (user?.user_metadata) {
      const meta = user.user_metadata;
      if (meta.emeb_name) setEmebName(meta.emeb_name);
      if (meta.emeb_address) setEmebAddress(meta.emeb_address);
      if (meta.emeb_cep) setEmebCep(meta.emeb_cep);
      if (meta.emeb_tel1) setEmebTel1(meta.emeb_tel1);
      if (meta.emeb_tel2) setEmebTel2(meta.emeb_tel2);
      if (meta.emeb_ato_criacao) setEmebAtoCriacao(meta.emeb_ato_criacao);
    }
  }, [user]);

  useEffect(() => {
    const handleTemplateLoad = (e: any) => {
      const data = e.detail;
      if (!data) return;

      const meta = user?.user_metadata || {};
      
      setEmebName(data.EMEB || meta.emeb_name || "");
      setEmebAddress(data.ENDERECO_EMEB || meta.emeb_address || "");
      setEmebCep(data.CEP_EMEB || meta.emeb_cep || "");
      setEmebTel1(data.TEL_1 || meta.emeb_tel1 || "");
      setEmebTel2(data.TEL_2 || meta.emeb_tel2 || "");
      setEmebAtoCriacao(data.ATO_DE_CRIACAO || meta.emeb_ato_criacao || "");
    };

    window.addEventListener("onTemplateLoaded", handleTemplateLoad);
    return () => window.removeEventListener("onTemplateLoaded", handleTemplateLoad);
  }, [user]);

  return (
    <section className="bg-surface-container-low rounded-2xl md:rounded-full overflow-hidden shadow-sm">
      <div className="bg-white px-4 md:px-8 py-4 md:py-6">
        <div
          className={`flex justify-between items-center cursor-pointer group select-none ${isExpanded ? 'mb-4 md:mb-6' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="account_balance">account_balance</span>
            <h3 className="text-sm md:text-lg font-bold font-headline text-primary uppercase tracking-wider">Dados da Unidade Escolar</h3>
          </div>
          <div className="text-secondary group-hover:text-primary transition-all p-1 -mr-1 rounded-full group-hover:bg-surface-variant/50">
            <span className="material-symbols-outlined" data-icon={isExpanded ? "expand_less" : "expand_more"}>
              {isExpanded ? "expand_less" : "expand_more"}
            </span>
          </div>
        </div>
        <div className={isExpanded ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nome da EMEB</label>
              <input type="text" name="EMEB" value={emebName} onChange={(e) => setEmebName(e.target.value)} onInvalid={() => setIsExpanded(true)} placeholder="EMEB NOME DA ESCOLA FICTÍCIA" required className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none placeholder:text-on-surface/30" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Endereço Completo</label>
              <input type="text" name="ENDERECO_EMEB" value={emebAddress} onChange={(e) => setEmebAddress(e.target.value)} onInvalid={() => setIsExpanded(true)} placeholder="Rua Exemplo Fictício, 123 - Bairro Imaginário - SBC - SP" required className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none placeholder:text-on-surface/30" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">CEP</label>
              <input type="text" name="CEP_EMEB" value={emebCep} onChange={(e) => setEmebCep(e.target.value)} onInvalid={() => setIsExpanded(true)} placeholder="09000-000" required className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none placeholder:text-on-surface/30" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Telefone 1</label>
              <input type="text" name="TEL_1" value={emebTel1} onChange={(e) => setEmebTel1(e.target.value)} onInvalid={() => setIsExpanded(true)} placeholder="(11) 4000-0000" required className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none placeholder:text-on-surface/30" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Telefone 2</label>
              <input type="text" name="TEL_2" value={emebTel2} onChange={(e) => setEmebTel2(e.target.value)} onInvalid={() => setIsExpanded(true)} placeholder="(11) 4000-0001" required className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none placeholder:text-on-surface/30" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Ato de Criação</label>
              <input type="text" name="ATO_DE_CRIACAO" value={emebAtoCriacao} onChange={(e) => setEmebAtoCriacao(e.target.value)} onInvalid={() => setIsExpanded(true)} placeholder="DECRETO nº 99.999 de 01/01/2000" required className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none placeholder:text-on-surface/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
