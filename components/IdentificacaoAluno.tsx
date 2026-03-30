"use client";

import { useState } from "react";

export function IdentificacaoAluno() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-surface-container-low rounded-2xl md:rounded-full overflow-hidden shadow-sm">
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div
          className={`flex justify-between items-center cursor-pointer group select-none ${isExpanded ? 'mb-4 md:mb-6' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="person">person</span>
            <h3 className="text-sm md:text-lg font-bold font-headline text-primary uppercase tracking-wider">Identificação do Aluno</h3>
          </div>
          <div className="text-secondary group-hover:text-primary transition-all p-1 -mr-1 rounded-full group-hover:bg-surface-variant/50">
            <span className="material-symbols-outlined" data-icon={isExpanded ? "expand_less" : "expand_more"}>
              {isExpanded ? "expand_less" : "expand_more"}
            </span>
          </div>
        </div>
        <div className={isExpanded ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-6 gap-x-8">
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Registro de Matrícula (RM)</label>
              <input type="text" name="RM" defaultValue="2026" className="bg-surface-container-highest px-3 py-2 rounded-lg font-mono text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nome Completo</label>
              <input type="text" name="NOME_ALUNO" defaultValue="GABRIEL FERREIRA SANTOS DE OLIVEIRA" className="bg-surface-container-highest px-3 py-2 rounded-lg font-semibold w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Naturalidade</label>
              <input type="text" name="MUNICIPIO" defaultValue="SÃO BERNARDO DO CAMPO" className="bg-surface-container-highest px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Estado</label>
              <input type="text" name="UF" defaultValue="SP" className="bg-surface-container-highest px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nacionalidade</label>
              <input type="text" name="NACION" defaultValue="BRASILEIRA" className="bg-surface-container-highest px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Data de Nascimento</label>
              <input type="text" name="DATA_NASCIMENTO" defaultValue="15/05/2012" className="bg-surface-container-highest px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Registro de Aluno (RA)</label>
              <input type="text" name="RA" defaultValue="109.876.543-2" className="bg-surface-container-highest px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">UF do RA</label>
              <input type="text" name="UF_RA" defaultValue="SP" className="bg-surface-container-highest px-3 py-2 rounded-lg text-primary font-bold w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
