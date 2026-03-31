"use client";

import { useState, useEffect } from "react";

export function TransferenciaDuranteAnoLetivo() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const handleTransfMarked = () => {
      setIsEmpty(false);
      setIsExpanded(true); // Optional: Expand the section when it automatically unchecks
    };
    const handleConclusionMarked = () => {
      setIsEmpty(true);
      setIsExpanded(false);
    };

    window.addEventListener("onTransfMarked", handleTransfMarked);
    window.addEventListener("onConclusionMarked", handleConclusionMarked);
    return () => {
      window.removeEventListener("onTransfMarked", handleTransfMarked);
      window.removeEventListener("onConclusionMarked", handleConclusionMarked);
    };
  }, []);

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
        <div className={isExpanded ? "block" : "hidden"}>
          <div className="mb-6 border-b border-outline-variant/30 pb-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-on-surface cursor-pointer p-2 hover:bg-surface-variant/30 rounded-lg transition">
              <input
                type="checkbox"
                name="SEM_TRANSF_MEIO_ANO"
                checked={isEmpty}
                onChange={(e) => setIsEmpty(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-outline"
              />
              Sem transferência / Enviar Vazio
            </label>
          </div>
          <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 ${isEmpty ? "opacity-50 pointer-events-none grayscale" : ""}`}>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Data de Matrícula</label>
              <input type="text" disabled={isEmpty} name="DATA_MATR" defaultValue="05/02/2026" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Data Transferência</label>
              <input type="text" disabled={isEmpty} name="DATA_TRANSF" placeholder="--/--/----" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Classe Sed</label>
              <input type="text" disabled={isEmpty} name="CLASSE" placeholder="999999999" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Turma</label>
              <input type="text" disabled={isEmpty} name="TURMA" placeholder="A" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Período/Turno</label>
              <input type="text" disabled={isEmpty} name="TURNO" placeholder="Manhã" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Ciclo</label>
              <input type="text" disabled={isEmpty} name="CICLO" placeholder="II" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Ano</label>
              <input type="text" disabled={isEmpty} name="ANO_TRANSF" placeholder="1º" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nº Chamada</label>
              <input type="text" disabled={isEmpty} name="N_CHAMADA" placeholder="12" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Total Faltas</label>
              <input type="text" disabled={isEmpty} name="FALTAS" placeholder="5" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Dias Letivos</label>
              <input type="text" disabled={isEmpty} name="DIAS_LET" placeholder="200" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Trimestre</label>
              <select disabled={isEmpty} name="ATE_TRIMESTRE" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none cursor-pointer">
                <option value="Vazio">Vazio</option>
                <option value="1º Trimestre">1º Trimestre</option>
                <option value="2º Trimestre">2º Trimestre</option>
                <option value="3º Trimestre">3º Trimestre</option>
              </select>
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Texto Resolução</label>
              <input type="text" disabled={isEmpty} name="TEXTO_RESOLUCAO_TRANSF" defaultValue="Resolução SE nº 14/2010" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
