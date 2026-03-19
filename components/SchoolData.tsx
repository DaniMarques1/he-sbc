"use client";

import { useState } from "react";

export function SchoolData() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-surface-container-low rounded-2xl md:rounded-full overflow-hidden shadow-sm">
      <div className="bg-white px-4 md:px-8 py-4 md:py-6">
        <div className={`flex justify-between items-start ${isExpanded ? 'mb-4 md:mb-6' : ''}`}>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="account_balance">account_balance</span>
            <h3 className="text-sm md:text-lg font-bold font-headline text-primary uppercase tracking-wider">Dados da Unidade Escolar</h3>
          </div>
          <button 
            className="text-secondary hover:text-primary transition-all p-1 -mr-1 rounded-full hover:bg-surface-variant/50"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="material-symbols-outlined" data-icon={isExpanded ? "expand_less" : "expand_more"}>
              {isExpanded ? "expand_less" : "expand_more"}
            </span>
          </button>
        </div>
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nome da EMEB</label>
            <input type="text" defaultValue="EMEB Professor Aristides Castelo Branco" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Endereço Completo</label>
            <input type="text" defaultValue="Rua das Acácias, 450 - Jardim das Flores - São Paulo - SP" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">CEP</label>
            <input type="text" defaultValue="01234-567" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Telefones</label>
            <input type="text" defaultValue="(11) 4002-8922 / (11) 4002-8923" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Ato de Criação</label>
            <input type="text" defaultValue="Decreto Municipal nº 12.345/2008" className="text-on-surface font-medium border-b border-outline-variant/20 pb-1 bg-transparent w-full focus:outline-none" />
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
