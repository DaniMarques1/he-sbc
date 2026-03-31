"use client";

import { useState } from "react";

export function DadosUnidadeEscolar() {
  const [isExpanded, setIsExpanded] = useState(false);

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
              <input type="text" name="EMEB" defaultValue="EMEB PROFESSOR PAULO FREIRE" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Endereço Completo</label>
              <input type="text" name="ENDERECO_EMEB" defaultValue="Estrada Henrique Rosa, 411 - Riacho Grande - SBC - SP" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">CEP</label>
              <input type="text" name="CEP_EMEB" defaultValue="09831-505" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Telefone 1</label>
              <input type="text" name="TEL_1" defaultValue="(11) 4354-0773" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Telefone 2</label>
              <input type="text" name="TEL_2" defaultValue="(11) 4101-7799" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Ato de Criação</label>
              <input type="text" name="ATO_DE_CRIACAO" defaultValue="DECRETO nº 13.061 de 11/11/99" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
