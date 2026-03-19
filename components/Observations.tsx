"use client";

import { useState } from "react";

export function Observations() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-white rounded-2xl md:rounded-full overflow-hidden shadow-sm border border-outline-variant/10">
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div 
          className={`flex justify-between items-center cursor-pointer group select-none ${isExpanded ? 'mb-4 md:mb-6' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="rate_review">rate_review</span>
            <h3 className="text-sm md:text-lg font-bold font-headline text-primary uppercase tracking-wider">Observações</h3>
          </div>
          <div className="text-secondary group-hover:text-primary transition-all p-1 -mr-1 rounded-full group-hover:bg-surface-variant/50">
            <span className="material-symbols-outlined" data-icon={isExpanded ? "expand_less" : "expand_more"}>
              {isExpanded ? "expand_less" : "expand_more"}
            </span>
          </div>
        </div>
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input defaultChecked className="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                <div>
                  <label className="text-sm font-semibold text-on-surface">Progressão Regular</label>
                  <input type="text" defaultValue="O aluno concluiu todos os componentes curriculares com aproveitamento satisfatório." className="text-xs text-secondary italic bg-transparent w-full focus:outline-none" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input className="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                <div>
                  <label className="text-sm font-semibold text-on-surface">Necessidades Especiais</label>
                  <input className="mt-1 block w-full bg-surface-container-high border-none rounded-lg text-xs py-2 px-3 focus:ring-1 focus:ring-primary" placeholder="Especificar adaptações curriculares..." type="text" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input className="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                <div>
                  <label className="text-sm font-semibold text-on-surface">Aceleração de Estudos</label>
                  <input type="text" defaultValue="Conforme Resolução SE nº 00/2024." className="text-xs text-secondary italic bg-transparent w-full focus:outline-none" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input defaultChecked className="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                <div>
                  <label className="text-sm font-semibold text-on-surface">Observações de Transferência</label>
                  <textarea className="mt-1 block w-full bg-surface-container-high border-none rounded-lg text-xs py-2 px-3 focus:ring-1 focus:ring-primary" rows={2} defaultValue="Documentação completa entregue na secretaria em conformidade com as exigências legais vigentes." />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
