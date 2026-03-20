"use client";

import { useState } from "react";

type Observation = { id: string; title: string; text: string; checked: boolean };

const defaultObs: Observation[] = [
  { id: '1', title: "Progressão Regular", text: "O aluno concluiu todos os componentes curriculares com aproveitamento satisfatório.", checked: true },
  { id: '2', title: "Necessidades Especiais", text: "Especificar adaptações curriculares...", checked: false },
  { id: '3', title: "Aceleração de Estudos", text: "Conforme Resolução SE nº 00/2024.", checked: false },
  { id: '4', title: "Observações de Transferência", text: "Documentação completa entregue na secretaria em conformidade com as exigências legais vigentes.", checked: true }
];

export function Observations() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [observations, setObservations] = useState<Observation[]>(defaultObs);

  const addObservation = () => {
    const newObs = {
      id: Date.now().toString(),
      title: "Nova Observação",
      text: "",
      checked: true
    };
    setObservations([...observations, newObs]);
  };

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
          <div className="flex flex-col gap-5">
            {observations.map((obs, index) => (
              <div key={obs.id} className="flex items-start gap-3 w-full">
                <input 
                  type="checkbox" 
                  checked={obs.checked}
                  onChange={(e) => {
                    const newObs = [...observations];
                    newObs[index].checked = e.target.checked;
                    setObservations(newObs);
                  }}
                  className="mt-1.5 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer" 
                />
                <div className="flex-1 flex flex-col gap-1">
                  <input 
                    type="text" 
                    value={obs.title} 
                    onChange={(e) => {
                      const newObs = [...observations];
                      newObs[index].title = e.target.value;
                      setObservations(newObs);
                    }}
                    className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none focus:border-b border-primary/30 pb-0.5 transition-colors" 
                  />
                  <textarea 
                    value={obs.text}
                    onChange={(e) => {
                      const newObs = [...observations];
                      newObs[index].text = e.target.value;
                      setObservations(newObs);
                    }}
                    disabled={!obs.checked}
                    className="w-full bg-surface-container-high border-none rounded-lg text-xs py-2 px-3 focus:ring-1 focus:ring-primary outline-none min-h-[60px] resize-y disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
                    rows={2}
                  />
                </div>
                {index >= 4 && (
                  <button 
                    onClick={() => {
                      const newObs = [...observations];
                      newObs.splice(index, 1);
                      setObservations(newObs);
                    }}
                    className="mt-1 text-error/70 hover:text-error transition-colors p-1 rounded-full hover:bg-error/10"
                    title="Remover observação"
                  >
                    <span className="material-symbols-outlined text-sm" data-icon="delete">delete</span>
                  </button>
                )}
              </div>
            ))}
            
            <button 
              onClick={addObservation}
              className="mt-2 flex items-center gap-2 self-start text-sm font-medium text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-lg" data-icon="add">add</span>
              Adicionar Observação
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
