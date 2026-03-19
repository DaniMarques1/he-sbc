"use client";

import { useState } from "react";

export function AcademicPath() {
  const [isExpanded, setIsExpanded] = useState(false);

  const records = [
    { year: "1º Ano", hours: "800h", calendar: "2019", school: "EMEB Prof. Aristides C. Branco", city: "São Bernardo", state: "SP" },
    { year: "2º Ano", hours: "800h", calendar: "2020", school: "EMEB Prof. Aristides C. Branco", city: "São Bernardo", state: "SP" },
    { year: "3º Ano", hours: "800h", calendar: "2021", school: "EMEB Prof. Aristides C. Branco", city: "São Bernardo", state: "SP" },
    { year: "4º Ano", hours: "800h", calendar: "2022", school: "EMEB Prof. Aristides C. Branco", city: "São Bernardo", state: "SP" },
    { year: "5º Ano", hours: "800h", calendar: "2023", school: "EMEB Prof. Aristides C. Branco", city: "São Bernardo", state: "SP" }
  ];

  return (
    <section className="bg-surface-container-low rounded-2xl md:rounded-full overflow-hidden shadow-sm">
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div className={`flex justify-between items-start ${isExpanded ? 'mb-4 md:mb-6' : ''}`}>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="history_edu">history_edu</span>
            <h3 className="text-sm md:text-lg font-bold font-headline text-primary uppercase tracking-wider">Percurso Acadêmico</h3>
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
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] font-bold text-secondary uppercase tracking-widest border-b border-outline-variant/20">
                <th className="px-4 py-3">Ano/Série</th>
                <th className="px-4 py-3">Carga Horária</th>
                <th className="px-4 py-3">Ano Calendário</th>
                <th className="px-4 py-3">Estabelecimento de Ensino</th>
                <th className="px-4 py-3">Cidade</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {records.map((record, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 font-semibold">
        <input type="text" defaultValue={record.year} className="w-full bg-transparent focus:outline-none focus:border-b border-primary/30" />
      </td>
                  <td className="px-4 py-4">
        <input type="text" defaultValue={record.hours} className="w-full bg-transparent focus:outline-none focus:border-b border-primary/30" />
      </td>
                  <td className="px-4 py-4">
        <input type="text" defaultValue={record.calendar} className="w-full bg-transparent focus:outline-none focus:border-b border-primary/30" />
      </td>
                  <td className="px-4 py-4">
        <input type="text" defaultValue={record.school} className="w-full bg-transparent focus:outline-none focus:border-b border-primary/30" />
      </td>
                  <td className="px-4 py-4">
        <input type="text" defaultValue={record.city} className="w-full bg-transparent focus:outline-none focus:border-b border-primary/30" />
      </td>
                  <td className="px-4 py-4">
        <input type="text" defaultValue={record.state} className="w-full bg-transparent focus:outline-none focus:border-b border-primary/30" />
      </td>
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
