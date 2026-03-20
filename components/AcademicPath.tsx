"use client";

import { useState } from "react";

export function AcademicPath() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transferIndex, setTransferIndex] = useState<number | null>(null);
  const [educarMaisChecked, setEducarMaisChecked] = useState<Record<number, boolean>>({});
  const isAnyEducarMaisChecked = Object.values(educarMaisChecked).some(Boolean);

  const records = [
    { year: "1º Ano", hours: "1000h", calendar: "2019", school: "EMEB Prof. Paulo Freire", city: "São Bernardo", state: "SP" },
    { year: "2º Ano", hours: "1000h", calendar: "2020", school: "EMEB Prof. Paulo Freire", city: "São Bernardo", state: "SP" },
    { year: "3º Ano", hours: "1000h", calendar: "2021", school: "EMEB Prof. Paulo Freire", city: "São Bernardo", state: "SP" },
    { year: "4º Ano", hours: "1000h", calendar: "2022", school: "EMEB Prof. Paulo Freire", city: "São Bernardo", state: "SP" },
    { year: "5º Ano", hours: "1000h", calendar: "2023", school: "EMEB Prof. Paulo Freire", city: "São Bernardo", state: "SP" }
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
            <table className="w-full text-left text-sm min-w-[900px]">
              <thead>
                <tr className="text-[10px] font-bold text-secondary uppercase tracking-widest border-b border-outline-variant/20">
                  <th className="px-2 py-3 whitespace-nowrap">Ano/Série</th>
                  <th className="px-2 py-3 whitespace-nowrap">Ano Calendário</th>
                  <th className="px-2 py-3 whitespace-nowrap">Carga Horária</th>
                  <th className="px-2 py-3 text-center whitespace-nowrap">Transferência</th>
                  <th className="px-2 py-3 text-center whitespace-nowrap">Educar Mais</th>
                  {isAnyEducarMaisChecked && (
                    <th className="px-2 py-3 whitespace-nowrap">C.H. Educar Mais</th>
                  )}
                  <th className="px-2 py-3 whitespace-nowrap">Estabelecimento de Ensino</th>
                  <th className="px-2 py-3 whitespace-nowrap">Cidade</th>
                  <th className="px-2 py-3 whitespace-nowrap">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {records.map((record, index) => {
                  const isAnyDisabled = transferIndex !== null && index > transferIndex;
                  const isEducarMais = !!educarMaisChecked[index];
                  const inputClass = "w-full bg-transparent focus:outline-none focus:border-b border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all";
                  return (
                    <tr key={index} className="hover:bg-surface-variant/10 transition-colors">
                      <td className="px-2 py-3 font-semibold min-w-[90px]">
                        <input type="text" defaultValue={record.year} disabled={isAnyDisabled} className={inputClass} />
                      </td>
                      <td className="px-2 py-3 min-w-[100px]">
                        <input type="text" defaultValue={record.calendar} disabled={isAnyDisabled} className={inputClass} />
                      </td>
                      <td className="px-2 py-3 min-w-[100px]">
                        <input type="text" defaultValue={record.hours} disabled={isAnyDisabled} className={inputClass} />
                      </td>
                      <td className="px-2 py-3 text-center min-w-[110px]">
                        <input
                          type="checkbox"
                          checked={transferIndex === index}
                          onChange={() => setTransferIndex(transferIndex === index ? null : index)}
                          className="w-4 h-4 cursor-pointer accent-primary"
                          title="Marcar como ano de transferência"
                        />
                      </td>
                      <td className="px-2 py-3 text-center min-w-[100px]">
                        <input
                          type="checkbox"
                          checked={isEducarMais}
                          onChange={() => setEducarMaisChecked({ ...educarMaisChecked, [index]: !isEducarMais })}
                          disabled={isAnyDisabled}
                          className="w-4 h-4 cursor-pointer accent-primary disabled:opacity-40"
                          title="Participou do Educar Mais?"
                        />
                      </td>
                      {isAnyEducarMaisChecked && (
                        <td className="px-2 py-3 min-w-[130px]">
                          {isEducarMais ? (
                            <input
                              key={`em-on-${index}`}
                              type="text"
                              defaultValue="600h"
                              disabled={isAnyDisabled}
                              className={inputClass}
                              placeholder="Ex: 600h"
                            />
                          ) : (
                            <input
                              key={`em-off-${index}`}
                              type="text"
                              value=""
                              disabled={true}
                              className={inputClass}
                            />
                          )}
                        </td>
                      )}
                      <td className="px-2 py-3 min-w-[180px]">
                        <input type="text" defaultValue={record.school} disabled={isAnyDisabled} className={inputClass} />
                      </td>
                      <td className="px-2 py-3 min-w-[120px]">
                        <input type="text" defaultValue={record.city} disabled={isAnyDisabled} className={inputClass} />
                      </td>
                      <td className="px-2 py-3 min-w-[70px]">
                        <input type="text" defaultValue={record.state} disabled={isAnyDisabled} className={inputClass} />
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
