"use client";

import { useState, useEffect } from "react";

export function TransferenciaDuranteAnoLetivo() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [anoTransf, setAnoTransf] = useState("1º");
  const [ciclo, setCiclo] = useState("I");

  const handleAnoChange = (value: string) => {
    setAnoTransf(value);
    if (value === "1º" || value === "2º" || value === "3º") {
      setCiclo("I");
    } else if (value === "4º" || value === "5º") {
      setCiclo("II");
    }
  };

  useEffect(() => {
    const handleTransfMarked = () => {
      setIsEmpty(false);
      setIsExpanded(true); // Optional: Expand the section when it automatically unchecks
    };
    const handleConclusionMarked = () => {
      setIsEmpty(true);
      setIsExpanded(false);
    };

    const handleTemplateLoad = (e: any) => {
      const data = e.detail;
      if (data) {
        if (data.isReset) {
          setIsEmpty(true);
          setAnoTransf("1º");
          setCiclo("I");
          return;
        }
        setIsEmpty(data.SEM_TRANSF_MEIO_ANO === "on" || data.SEM_TRANSF_MEIO_ANO === true);
        if (data.ANO_TRANSF) {
          setAnoTransf(data.ANO_TRANSF);
        }
        if (data.CICLO) {
          setCiclo(data.CICLO);
        }
      }
    };

    window.addEventListener("onTransfMarked", handleTransfMarked);
    window.addEventListener("onConclusionMarked", handleConclusionMarked);
    window.addEventListener("onTemplateLoaded", handleTemplateLoad);
    return () => {
      window.removeEventListener("onTransfMarked", handleTransfMarked);
      window.removeEventListener("onConclusionMarked", handleConclusionMarked);
      window.removeEventListener("onTemplateLoaded", handleTemplateLoad);
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
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${isEmpty ? "opacity-50 pointer-events-none grayscale" : ""}`}>
            {/* Line 1: Classe/Turno/Matr./Transf. */}
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Classe SED</label>
              <input type="text" disabled={isEmpty} name="CLASSE" placeholder="999999999" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Turno</label>
              <select disabled={isEmpty} name="TURNO" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none cursor-pointer">
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Integral">Integral</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Data de Matrícula</label>
              <input type="text" disabled={isEmpty} name="DATA_MATR" placeholder="DD/MM/AAAA" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Data de Transferência</label>
              <input type="text" disabled={isEmpty} name="DATA_TRANSF" placeholder="DD/MM/AAAA" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>

            {/* Line 2: Série/Turma/Ciclo/Nº */}
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Série/Ano</label>
              <select
                disabled={isEmpty}
                name="ANO_TRANSF"
                value={anoTransf}
                onChange={(e) => handleAnoChange(e.target.value)}
                className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none cursor-pointer"
              >
                <option value="1º">1º</option>
                <option value="2º">2º</option>
                <option value="3º">3º</option>
                <option value="4º">4º</option>
                <option value="5º">5º</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Turma</label>
              <input type="text" disabled={isEmpty} name="TURMA" placeholder="A" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Ciclo</label>
              <select
                disabled={isEmpty}
                name="CICLO"
                value={ciclo}
                onChange={(e) => setCiclo(e.target.value)}
                className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none cursor-pointer"
              >
                <option value="I">I</option>
                <option value="II">II</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nº Chamada</label>
              <input type="text" disabled={isEmpty} name="N_CHAMADA" placeholder="12" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>

            {/* Line 3: Faltas, Dias Letivos, Trimestre, Texto Resolução */}
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
            <div className="space-y-1">
              <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Texto Resolução</label>
              <input type="text" disabled={isEmpty} name="TEXTO_RESOLUCAO_TRANSF" defaultValue="Resolução SE nº 14/2010" className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none placeholder:text-on-surface/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
