"use client";

import { useState } from "react";

export function ResultsTable() {
  const [isExpanded, setIsExpanded] = useState(false);

  const subjects = [
    { name: "Língua Portuguesa", grade: "9.0" },
    { name: "Matemática", grade: "8.5" },
    { name: "História", grade: "9.5" },
    { name: "Geografia", grade: "8.0" },
    { name: "Ciências Físicas e Biológicas", grade: "7.5" },
    { name: "Arte", grade: "10.0" },
    { name: "Educação Física", grade: "9.0" },
    { name: "Língua Estrangeira Moderna (Inglês)", grade: "8.0" },
    { name: "Ensino Religioso", grade: "9.0" },
    { name: "Filosofia", grade: "8.5" },
    { name: "Sociologia", grade: "7.0" },
    { name: "Trabalho e Tecnologia", grade: "10.0" },
    { name: "Diversidade Cultural", grade: "9.5" }
  ];

  return (
    <section className="bg-white rounded-full overflow-hidden shadow-sm border border-outline-variant/10">
      <div className="px-8 py-6">
        <div className={`flex justify-between items-start ${isExpanded ? 'mb-6' : ''}`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="grade">grade</span>
            <h3 className="text-lg font-bold font-headline text-primary uppercase tracking-wider">Resultados do Ensino Fundamental</h3>
          </div>
          <button
            className="text-secondary hover:text-primary transition-all p-1 -mr-1 rounded-full hover:bg-surface-variant/50"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="material-symbols-outlined" data-icon={isExpanded ? "expand_less" : "expand_more"}>
              {isExpanded ? "expand_less" : "expand_more"}
            </span>
          </button>
        </div>
        {isExpanded && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-outline-variant/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-container text-white">
                  <th className="px-6 py-3 text-[10px] font-label font-bold uppercase tracking-widest border-r border-white/10">Disciplinas Estudadas</th>
                  {[1, 2, 3, 4, 5].map(year => (
                    <th key={year} className="px-2 py-3 text-[10px] font-label font-bold uppercase tracking-widest text-center">{year}º Ano</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {subjects.map((subject) => (
                  <tr key={subject.name} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-3 font-medium text-sm text-on-surface">
                      <input type="text" defaultValue={subject.name} className="w-full bg-transparent focus:outline-none focus:border-b border-primary/30" />
                    </td>
                    {[1, 2, 3, 4, 5].map(year => (
                      <td key={year} className="px-2 py-3 text-center">
                        <input
                          type="text"
                          defaultValue="Resolução"
                          onFocus={(e) => e.target.select()}
                          className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full text-[11px] font-bold w-[76px] text-center focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
