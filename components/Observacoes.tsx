"use client";

import { useState, useEffect } from "react";

type Observation = { id: string; title: string; text: string; checked: boolean };

const defaultObs: Observation[] = [
  { id: '1', title: "Fundamental 9 Anos: ", text: "Conforme <b>Resolução SE nº 14/2010</b>, alterada pela <b>Resolução SE nº 16/2011</b> e <b>CME nº 02/2017</b> o primeiro segmento do Ensino Fundamental nas Escolas Municipais, com duração de no mínimo 5 (cinco) anos, organiza-se em Ciclo I (1º, 2º e 3º anos) e Ciclo II (4º e 5º anos).", checked: true },
  { id: '2', title: "Divisão do Ano Letivo: ", text: "Conforme <b>Deliberação CME nº 03/2010</b>, a divisão do ano letivo passa a ser organizada em 3 (três) trimestres na Rede Municipal de Ensino de São Bernardo do Campo.", checked: true },
  { id: '4', title: "Legislações que regulamentam o ano de 2020: ", text: "", checked: false },
  { id: '5', title: "Lei 14 040/2020: ", text: "Estabeleceu normas educacionais excepcionais adotadas durante o estado de calamidade pública reconhecido pelo Decreto Legislativo nº 6, de 20 de março de 2020.", checked: false },
  { id: '6', title: "Deliberação CME 01/2020: ", text: "Fixou normas quanto à reorganização dos calendários escolares para as instituições vinculadas ao Sistema Municipal de Ensino de São Bernardo do Campo, devido a suspensão das aulas presenciais em virtude da pandemia do COVID-19", checked: false },
  { id: '7', title: "Deliberação CME 02/2020: ", text: "Dispõe sobre a divisão do ano letivo de 2020 em dois períodos na Rede Municipal de Ensino de São Bernardo do Campo, homologada pela Resolução da SE 16/2020, períodos definidos na Resolução SE 32/2020, alterado pela Resolução SE 33/2020.", checked: false },
  { id: '8', title: "Resolução SE 40/2020: ", text: "Dispõe sobre o conceito de reordenamento da trajetória escolar em um continuum de dois anos (2020/2021) e a avaliação das aprendizagens dos estudantes da Rede Municipal de Ensino de São Bernardo do Campo.", checked: false },
  { id: '3', title: "", text: "As Fichas de Rendimento Escolar do aluno correspondentes aos estudos realizados no ano letivo em curso seguem anexas ao Histórico Escolar.", checked: true }
];

export function Observacoes() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [is2020Expanded, setIs2020Expanded] = useState(false);
  const [observations, setObservations] = useState<Observation[]>(defaultObs);

  useEffect(() => {
    const handleYearDetect = () => {
      setObservations(prev => {
        const newObs = [...prev];
        let changed = false;
        for (let i = 2; i <= 6; i++) {
          if (newObs[i] && !newObs[i].checked) {
            newObs[i].checked = true;
            changed = true;
          }
        }
        return changed ? newObs : prev;
      });
      setIs2020Expanded(true);
      setIsExpanded(true);
    };

    window.addEventListener("onYear2020or2021Detected", handleYearDetect);

    const handleTemplateLoad = (e: any) => {
      const data = e.detail;
      if (!data) return;

      // Busca todas as chaves que começam com obs_title_ para identificar as observações salvas
      const obsIds = Object.keys(data)
        .filter(k => k.startsWith('obs_title_'))
        .map(k => k.replace('obs_title_', ''));

      if (obsIds.length > 0) {
        const newObs: Observation[] = obsIds.map(id => ({
          id,
          title: data[`obs_title_${id}`] || "",
          text: data[`obs_text_${id}`] || "",
          checked: data[`obs_checked_${id}`] === "on"
        }));
        
        // Ordenação básica: IDs numéricos primeiro, depois por timestamp (Date.now)
        newObs.sort((a, b) => {
          const aNum = parseInt(a.id);
          const bNum = parseInt(b.id);
          if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
          return a.id.localeCompare(b.id);
        });

        setObservations(newObs);
      }
    };

    window.addEventListener("onTemplateLoaded", handleTemplateLoad);

    return () => {
      window.removeEventListener("onYear2020or2021Detected", handleYearDetect);
      window.removeEventListener("onTemplateLoaded", handleTemplateLoad);
    };
  }, []);

  const addObservation = () => {
    const newObs = {
      id: Date.now().toString(),
      title: "Nova Observação",
      text: "",
      checked: true
    };
    const id3Index = observations.findIndex(o => o.id === '3');
    if (id3Index !== -1) {
      const newArr = [...observations];
      newArr.splice(id3Index, 0, newObs);
      setObservations(newArr);
    } else {
      setObservations([...observations, newObs]);
    }
  };

  const renderObservation = (obs: Observation, index: number) => (
    <div key={obs.id} className="flex items-start gap-3 w-full">
      <input
        type="checkbox"
        name={`obs_checked_${obs.id}`}
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
          name={`obs_title_${obs.id}`}
          value={obs.title}
          onChange={(e) => {
            const newObs = [...observations];
            newObs[index].title = e.target.value;
            setObservations(newObs);
          }}
          disabled={!obs.checked}
          className="text-sm font-semibold text-on-surface bg-transparent w-full focus:outline-none focus:border-b border-primary/30 pb-0.5 transition-colors"
        />
        <textarea
          name={`obs_text_${obs.id}`}
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
      {!defaultObs.find(d => d.id === obs.id) && (
        <button
          type="button"
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
  );

  const group2020 = observations.slice(2, 7);
  const all2020Checked = group2020.length > 0 && group2020.every(o => o.checked);
  const some2020Checked = group2020.some(o => o.checked);

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
        <div className={isExpanded ? "block" : "hidden"}>
          <div className="flex flex-col gap-5">
            {observations.slice(0, 2).map((obs, index) => renderObservation(obs, index))}

            {observations.length >= 7 && (
              <div className="border border-outline-variant/50 rounded-xl overflow-hidden mt-2 mb-2">
                <div
                  className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-surface-variant/20 transition-colors select-none bg-surface-variant/10"
                  onClick={() => setIs2020Expanded(!is2020Expanded)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={all2020Checked}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = some2020Checked && !all2020Checked;
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newObs = [...observations];
                        for (let i = 2; i <= 6; i++) {
                          if (newObs[i]) {
                            newObs[i].checked = checked;
                          }
                        }
                        setObservations(newObs);
                      }}
                      className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      title="Selecionar/Desselecionar todos"
                    />
                    <h4 className="font-bold text-sm md:text-base text-primary">Anos de 2020/2021</h4>
                  </div>
                  <div className="text-secondary p-1 rounded-full transition-all">
                    <span className="material-symbols-outlined">
                      {is2020Expanded ? "expand_less" : "expand_more"}
                    </span>
                  </div>
                </div>

                <div className={is2020Expanded ? "block" : "hidden"}>
                  <div className="p-4 flex flex-col gap-5 border-t border-outline-variant/30">
                    {group2020.map((obs, localIndex) => renderObservation(obs, localIndex + 2))}
                  </div>
                </div>
              </div>
            )}

            {observations.length > 7 && observations.slice(7).map((obs, localIndex) => renderObservation(obs, localIndex + 7))}

            <button
              type="button"
              onClick={addObservation}
              className="mt-2 flex items-center gap-2 self-start text-sm font-medium text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-lg" data-icon="add">add</span>
              Adicionar Observação
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
