"use client";

import { useState } from "react";

export function TransferData() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-white rounded-full overflow-hidden shadow-sm border border-outline-variant/10">
      <div className="px-8 py-6">
        <div className={`flex justify-between items-start ${isExpanded ? 'mb-6' : ''}`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="move_item">move_item</span>
            <h3 className="text-lg font-bold font-headline text-primary uppercase tracking-wider">Transferência durante Período Letivo</h3>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Data de Matrícula</label>
            <input type="text" defaultValue="02/02/2024" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Data Transferência</label>
            <input type="text" defaultValue="--/--/----" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Classe/Turma</label>
            <input type="text" defaultValue="6º Ano A" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Período/Turno</label>
            <input type="text" defaultValue="Manhã" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Ciclo/Ano</label>
            <input type="text" defaultValue="2º Ciclo / 6º Ano" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Total Faltas</label>
            <input type="text" defaultValue="02" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Dias Letivos</label>
            <input type="text" defaultValue="200" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
