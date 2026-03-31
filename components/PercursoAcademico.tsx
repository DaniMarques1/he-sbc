"use client";

import { useState } from "react";

export function PercursoAcademico() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transferIndex, setTransferIndex] = useState<number | null>(null);
  const [conclusionIndex, setConclusionIndex] = useState<number | null>(null);
  const [educarMaisChecked, setEducarMaisChecked] = useState<Record<number, boolean>>({});
  const isAnyEducarMaisChecked = Object.values(educarMaisChecked).some(Boolean);

  const records = [
    { year: "1º Ano", hours: "1000", calendar: "2022", school: "EMEB Professor Paulo Freire", city: "São Bernardo do Campo", state: "SP" },
    { year: "2º Ano", hours: "1000", calendar: "2023", school: "EMEB Professor Paulo Freire", city: "São Bernardo do Campo", state: "SP" },
    { year: "3º Ano", hours: "1000", calendar: "2024", school: "EMEB Professor Paulo Freire", city: "São Bernardo do Campo", state: "SP" },
    { year: "4º Ano", hours: "1000", calendar: "2025", school: "EMEB Professor Paulo Freire", city: "São Bernardo do Campo", state: "SP" },
    { year: "5º Ano", hours: "1000", calendar: "2026", school: "EMEB Professor Paulo Freire", city: "São Bernardo do Campo", state: "SP" }
  ];

  return (
    <section className="bg-surface-container-low rounded-2xl md:rounded-full overflow-hidden shadow-sm">
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div
          className={`flex justify-between items-center cursor-pointer group select-none ${isExpanded ? 'mb-4 md:mb-6' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="history_edu">history_edu</span>
            <h3 className="text-sm md:text-lg font-bold font-headline text-primary uppercase tracking-wider">Percurso Acadêmico</h3>
          </div>
          <div className="text-secondary group-hover:text-primary transition-all p-1 -mr-1 rounded-full group-hover:bg-surface-variant/50">
            <span className="material-symbols-outlined" data-icon={isExpanded ? "expand_less" : "expand_more"}>
              {isExpanded ? "expand_less" : "expand_more"}
            </span>
          </div>
        </div>
        {isExpanded && (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left text-sm min-w-[900px]">
              <thead>
                <tr className="text-[10px] font-bold text-secondary uppercase tracking-widest border-b border-outline-variant/20">
                  {/* Para alterar as larguras, basta editar os valores de w-[...px] abaixo. A coluna sem w-[...] ocupará o espaço restante. */}
                  <th className="px-2 py-3 whitespace-nowrap w-[70px]">Série</th>
                  <th className="px-2 py-3 whitespace-nowrap w-[70px]">Ano</th>
                  <th className="px-2 py-3 whitespace-nowrap w-[70px]">C.H</th>
                  <th className="px-2 py-3 text-center whitespace-nowrap w-[80px]">Conclusão</th>
                  <th className="px-2 py-3 text-center whitespace-nowrap w-[60px]">Transf.</th>
                  <th className="px-2 py-3 text-center whitespace-nowrap w-[70px]">Educar +</th>
                  {isAnyEducarMaisChecked && (
                    <th className="px-2 py-3 whitespace-nowrap w-[70px]">C.H. Ed. +</th>
                  )}
                  <th className="px-2 py-3 whitespace-nowrap ">Estabelecimento de Ensino</th>
                  <th className="px-2 py-3 whitespace-nowrap w-[250px]">Cidade</th>
                  <th className="px-2 py-3 whitespace-nowrap w-[70px]">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {records.map((record, index) => {
                  const isAnyDisabled =
                    (transferIndex !== null && index > transferIndex) ||
                    (conclusionIndex !== null && index > conclusionIndex);
                  const isEducarMais = !!educarMaisChecked[index];
                  const inputClass = "w-full bg-transparent focus:outline-none focus:border-b border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all";
                  return (
                    <tr key={index} className="hover:bg-surface-variant/10 transition-colors">
                      <td className="px-2 py-3 font-semibold">
                        <input type="text" defaultValue={record.year} disabled={isAnyDisabled} className={inputClass} />
                      </td>
                      <td className="px-2 py-3">
                        <input
                          type="text"
                          name={`ANO_${index + 1}`}
                          defaultValue={record.calendar}
                          disabled={isAnyDisabled}
                          className={inputClass}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            if (val === "2020" || val === "2021") {
                              window.dispatchEvent(new CustomEvent("onYear2020or2021Detected"));
                            }
                          }}
                        />
                      </td>
                      <td className="px-2 py-3">
                        <input type="text" name={`HORAS_${index + 1}`} defaultValue={record.hours} disabled={isAnyDisabled} className={inputClass} />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="checkbox"
                          name={`CONCLUSAO_${index + 1}`}
                          checked={conclusionIndex === index}
                          onChange={() => {
                            const newIndex = conclusionIndex === index ? null : index;
                            setConclusionIndex(newIndex);
                            if (newIndex !== null) {
                              setTransferIndex(null);
                              window.dispatchEvent(new CustomEvent("onConclusionMarked"));
                            }
                          }}
                          disabled={isAnyDisabled}
                          className="w-4 h-4 cursor-pointer accent-primary disabled:opacity-40"
                          title="Marcar como ano de conclusão"
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="checkbox"
                          name={`TRANSF_${index + 1}`}
                          checked={transferIndex === index}
                          onChange={() => {
                            const newIndex = transferIndex === index ? null : index;
                            setTransferIndex(newIndex);
                            if (newIndex !== null) {
                              setConclusionIndex(null);
                              window.dispatchEvent(new CustomEvent("onTransfMarked"));
                            }
                          }}
                          disabled={isAnyDisabled}
                          className="w-4 h-4 cursor-pointer accent-primary disabled:opacity-40"
                          title="Marcar como ano de transferência"
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="checkbox"
                          name={`EDUCARMAIS_${index + 1}`}
                          checked={isEducarMais}
                          onChange={() => setEducarMaisChecked({ ...educarMaisChecked, [index]: !isEducarMais })}
                          disabled={isAnyDisabled}
                          className="w-4 h-4 cursor-pointer accent-primary disabled:opacity-40"
                          title="Participou do Educar Mais?"
                        />
                      </td>
                      {isAnyEducarMaisChecked && (
                        <td className="px-2 py-3">
                          {isEducarMais ? (
                            <input
                              key={`em-on-${index}`}
                              type="text"
                              name={`HMAIS_${index + 1}`}
                              defaultValue="600h"
                              disabled={isAnyDisabled}
                              className={inputClass}
                              placeholder="Ex: 600h"
                            />
                          ) : (
                            <input
                              key={`em-off-${index}`}
                              type="text"
                              name={`HMAIS_${index + 1}`}
                              value=""
                              disabled={true}
                              className={inputClass}
                            />
                          )}
                        </td>
                      )}
                      <td className="px-2 py-3">
                        <input type="text" name={`ESCOLA_${index + 1}`} defaultValue={record.school} disabled={isAnyDisabled} className={inputClass} />
                      </td>
                      <td className="px-2 py-3">
                        <input type="text" name={`MUNIC_${index + 1}`} defaultValue={record.city} disabled={isAnyDisabled} className={inputClass} />
                      </td>
                      <td className="px-2 py-3">
                        <input type="text" name={`UF_${index + 1}`} defaultValue={record.state} disabled={isAnyDisabled} className={inputClass} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
