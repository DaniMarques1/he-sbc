"use client";

import { useState } from "react";

export function ResultsTable() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rowTypes, setRowTypes] = useState<Record<number, string>>({
    1: 'Resolução',
    2: 'Resolução',
    3: 'Resolução',
    4: 'Resolução',
    5: 'Resolução',
  });

  const subjects = [
    { name: "HISTÓRIA", grade: "9.0" },
    { name: "GEOGRAFIA", grade: "8.5" },
    { name: "CIÊNCIAS NATURAIS ", grade: "9.5" },
    { name: "MATEMÁTICA", grade: "8.0" },
    { name: "EDUCAÇÃO FÍSICA", grade: "7.5" },
    { name: "ARTE", grade: "10.0" },
    { name: "LÍNGUA PORTUGUESA", grade: "9.0" },
    { name: "", grade: "8.0" },
    { name: "", grade: "9.0" },
    { name: "", grade: "8.5" },
    { name: "", grade: "7.0" },
    { name: "", grade: "10.0" },
    { name: "", grade: "9.5" }
  ];

  return (
    <section className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div
          className={`flex justify-between items-center cursor-pointer group select-none ${isExpanded ? 'mb-4 md:mb-6' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="grade">grade</span>
            <h3 className="text-sm md:text-lg font-bold font-headline text-primary uppercase tracking-wider">Resultados do Ensino Fundamental</h3>
          </div>
          <div className="text-secondary group-hover:text-primary transition-all p-1 -mr-1 rounded-full group-hover:bg-surface-variant/50">
            <span className="material-symbols-outlined" data-icon={isExpanded ? "expand_less" : "expand_more"}>
              {isExpanded ? "expand_less" : "expand_more"}
            </span>
          </div>
        </div>
        {isExpanded && (
          <div className="flex flex-col gap-6">
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-outline-variant/10">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-primary-container text-white">
                    <th className="px-6 py-3 text-[10px] font-label font-bold uppercase tracking-widest border-r border-white/10 w-32 text-center md:text-left">Série</th>
                    <th className="px-6 py-3 text-[10px] font-label font-bold uppercase tracking-widest border-r border-white/10 w-48 text-center md:text-left">Tipo</th>
                    <th className="px-6 py-3 text-[10px] font-label font-bold uppercase tracking-widest text-center md:text-left">Resolução</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {[1, 2, 3, 4, 5].map((year) => (
                    <tr key={year} className="hover:bg-surface-container transition-colors">
                      <td className="px-6 py-3 font-medium text-sm text-on-surface whitespace-nowrap text-center md:text-left">
                        {year}º Ano
                      </td>
                      <td className="px-6 py-3">
                        <select
                          value={rowTypes[year] || 'Resolução'}
                          onChange={(e) => setRowTypes({ ...rowTypes, [year]: e.target.value })}
                          className="bg-secondary-container text-on-secondary-container px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all w-full cursor-pointer"
                        >
                          <option value="Notas">Notas</option>
                          <option value="Resolução">Resolução</option>
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          defaultValue="Resolução SE nº 14/2010"
                          disabled={rowTypes[year] === 'Notas'}
                          className="w-full bg-transparent px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-b border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-outline-variant/10">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-primary-container text-white">
                    <th className="px-6 py-3 text-[10px] font-label font-bold uppercase tracking-widest border-r border-white/10">Disciplinas Estudadas</th>
                    {[1, 2, 3, 4, 5].map(year => (
                      <th key={year} className="px-2 py-3 text-[10px] font-label font-bold uppercase tracking-widest text-center">{year}º Ano</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-surface-container transition-colors">
                      <td className="px-6 py-3 font-medium text-sm text-on-surface">
                        <input type="text" defaultValue={subject.name} placeholder="Nome da disciplina..." className="w-full bg-transparent focus:outline-none focus:border-b border-primary/30" />
                      </td>
                      {[1, 2, 3, 4, 5].map(year => {
                        const isResumo = rowTypes[year] !== 'Notas';
                        return (
                          <td key={year} className="px-2 py-3 text-center">
                            <input
                              key={`input-${year}-${isResumo}`}
                              type="text"
                              defaultValue={isResumo ? "Resolução" : "10"}
                              disabled={isResumo}
                              onFocus={(e) => e.target.select()}
                              className={`px-2 py-1 rounded-full text-[11px] font-bold w-[76px] text-center focus:outline-none transition-all shadow-sm ${isResumo
                                ? "bg-surface-variant/50 text-on-surface/50 cursor-not-allowed"
                                : "bg-secondary-container text-on-secondary-container focus:ring-2 focus:ring-primary focus:bg-white"
                                }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
