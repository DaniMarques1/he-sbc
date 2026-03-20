"use client";

import { useState } from "react";

export function TransferData() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-white rounded-2xl md:rounded-full overflow-hidden shadow-sm border border-outline-variant/10">
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div 
          className={`flex justify-between items-center cursor-pointer group select-none ${isExpanded ? 'mb-4 md:mb-6' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="move_item">move_item</span>
            <h3 className="text-sm md:text-lg font-bold font-headline text-primary uppercase tracking-wider">Transferência durante Período Letivo</h3>
          </div>
          <div className="text-secondary group-hover:text-primary transition-all p-1 -mr-1 rounded-full group-hover:bg-surface-variant/50">
            <span className="material-symbols-outlined" data-icon={isExpanded ? "expand_less" : "expand_more"}>
              {isExpanded ? "expand_less" : "expand_more"}
            </span>
          </div>
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
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Classe</label>
            <input type="text" defaultValue="6º Ano" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Turma</label>
            <input type="text" defaultValue="A" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Período/Turno</label>
            <input type="text" defaultValue="Manhã" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Ciclo</label>
            <input type="text" defaultValue="2º Ciclo" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Ano</label>
            <input type="text" defaultValue="6º Ano" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Total Faltas</label>
            <input type="text" defaultValue="02" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Dias Letivos</label>
            <input type="text" defaultValue="200" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Até o</label>
            <select className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none cursor-pointer">
              <option value="1º Trimestre">1º Trimestre</option>
              <option value="2º Trimestre">2º Trimestre</option>
              <option value="3º Trimestre">3º Trimestre</option>
            </select>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
