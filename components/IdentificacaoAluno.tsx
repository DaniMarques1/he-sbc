"use client";

import { useState, useEffect } from "react";

export function IdentificacaoAluno() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isBatchMode, setIsBatchMode] = useState(false);
  
  const emptyStudent = { RM: "", NOME_ALUNO: "", MUNICIPIO: "SÃO BERNARDO DO CAMPO", UF: "SP", NACION: "BRASILEIRA", DATA_NASCIMENTO: "", RA: "", UF_RA: "SP" };
  const [batchData, setBatchData] = useState<any[]>([{ ...emptyStudent }]);

  useEffect(() => {
    const handleTemplateLoad = (e: any) => {
      const data = e.detail;
      if (!data) return;

      if (data["MALA_DIRETA_ENABLED"] === "true") {
        setIsBatchMode(true);
        if (data["ALUNOS_BATCH"]) {
          try {
            const parsedBatch = JSON.parse(data["ALUNOS_BATCH"]);
            if (Array.isArray(parsedBatch) && parsedBatch.length > 0) {
              setBatchData(parsedBatch);
            }
          } catch (e) {
            console.error("Falha ao analisar o JSON do lote salvo no template.");
          }
        }
      } else {
        setIsBatchMode(false);
      }
    };

    window.addEventListener("onTemplateLoaded", handleTemplateLoad);
    return () => window.removeEventListener("onTemplateLoaded", handleTemplateLoad);
  }, []);

  const handleAddRow = () => {
    if (batchData.length < 200) {
      setBatchData([...batchData, { ...emptyStudent }]);
    }
  };

  const handleRemoveRow = (index: number) => {
    if (batchData.length > 1) {
      const newBatch = [...batchData];
      newBatch.splice(index, 1);
      setBatchData(newBatch);
    }
  };

  const updateBatchField = (index: number, field: string, value: string) => {
    const newBatch = [...batchData];
    newBatch[index][field] = value;
    setBatchData(newBatch);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text");
    const rows = pastedData.split("\n").filter(row => row.trim() !== "");
    
    const newBatch = [...batchData];
    
    rows.forEach(row => {
      const cols = row.split("\t").map(c => c.trim());
      // Expecting: RM, Nome, Municipio, UF, Nacion, Data Nasc, RA, UF_RA
      if (cols.length >= 2 && newBatch.length < 200) {
        // If the last row is empty, overwrite it, else push new
        const targetRow = (newBatch.length === 1 && newBatch[0].NOME_ALUNO === "") ? 0 : newBatch.length;
        
        const freshStudent = {
          RM: cols[0] || "",
          NOME_ALUNO: cols[1] || "",
          MUNICIPIO: cols[2] || "SÃO BERNARDO DO CAMPO",
          UF: cols[3] || "SP",
          NACION: cols[4] || "BRASILEIRA",
          DATA_NASCIMENTO: cols[5] || "",
          RA: cols[6] || "",
          UF_RA: cols[7] || "SP"
        };

        if (targetRow === 0) {
          newBatch[0] = freshStudent;
        } else {
          newBatch.push(freshStudent);
        }
      }
    });

    setBatchData(newBatch.slice(0, 200)); // Limit to 200
  };

  return (
    <section className="bg-surface-container-low rounded-2xl md:rounded-full overflow-hidden shadow-sm">
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div className="flex justify-between items-center group select-none mb-4 md:mb-6">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer flex-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="material-symbols-outlined text-primary" data-icon="person">person</span>
            <h3 className="text-sm md:text-lg font-bold font-headline text-primary uppercase tracking-wider">Identificação do Aluno</h3>
            <div className="text-secondary group-hover:text-primary transition-all p-1 -mr-1 rounded-full group-hover:bg-surface-variant/50">
                <span className="material-symbols-outlined" data-icon={isExpanded ? "expand_less" : "expand_more"}>{isExpanded ? "expand_less" : "expand_more"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1 rounded-full border border-outline-variant/30">
             <label className="text-xs font-semibold text-secondary cursor-pointer">Mala Direta (Lote)</label>
             <input type="checkbox" className="w-4 h-4 cursor-pointer accent-primary" checked={isBatchMode} onChange={(e) => setIsBatchMode(e.target.checked)} />
          </div>
        </div>

        <div className={isExpanded ? "block" : "hidden"}>
          {!isBatchMode ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-y-6 gap-x-8">
              <input type="hidden" name="MALA_DIRETA_ENABLED" value="false" />
              <div className="space-y-1">
                <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Registro de Matrícula (RM)</label>
                <input type="text" name="RM" defaultValue="2026" className="bg-surface-container-highest px-3 py-2 rounded-lg font-mono text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
              </div>
              <div className="md:col-span-3 space-y-1">
                <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nome Completo</label>
                <input type="text" name="NOME_ALUNO" defaultValue="GABRIEL FERREIRA SANTOS DE OLIVEIRA" className="bg-surface-container-highest px-3 py-2 rounded-lg font-semibold w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Naturalidade</label>
                <input type="text" name="MUNICIPIO" defaultValue="SÃO BERNARDO DO CAMPO" className="bg-surface-container-highest px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Estado</label>
                <input type="text" name="UF" defaultValue="SP" className="bg-surface-container-highest px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nacionalidade</label>
                <input type="text" name="NACION" defaultValue="BRASILEIRA" className="bg-surface-container-highest px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Data de Nascimento</label>
                <input type="text" name="DATA_NASCIMENTO" defaultValue="15/05/2012" className="bg-surface-container-highest px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Registro de Aluno (RA)</label>
                <input type="text" name="RA" defaultValue="109.876.543-2" className="bg-surface-container-highest px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">UF do RA</label>
                <input type="text" name="UF_RA" defaultValue="SP" className="bg-surface-container-highest px-3 py-2 rounded-lg text-primary font-bold w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <input type="hidden" name="MALA_DIRETA_ENABLED" value="true" />
              <input type="hidden" name="ALUNOS_BATCH" value={JSON.stringify(batchData)} />
              
              <div className="flex justify-between items-center text-xs text-secondary bg-primary/10 px-4 py-2 rounded-xl">
                 <span>Você pode copiar células do Excel e colar na tabela abaixo (Ctrl+V) ou adicionar alunos manualmente.</span>
                 <span className="font-bold">{batchData.length}/200 Alunos</span>
              </div>

              <div className="overflow-x-auto border border-outline-variant/30 rounded-xl max-h-[400px] overflow-y-auto" onPaste={handlePaste}>
                <table className="w-full text-left text-xs min-w-[900px] border-collapse relative">
                  <thead className="bg-surface-container sticky top-0 z-10 shadow-sm">
                    <tr className="text-[10px] font-bold text-secondary uppercase tracking-widest border-b border-outline-variant/20">
                      <th className="px-2 py-3 w-[80px]">RM</th>
                      <th className="px-2 py-3 w-[250px]">Nome Completo</th>
                      <th className="px-2 py-3 w-[150px]">Naturalidade</th>
                      <th className="px-2 py-3 w-[50px]">UF</th>
                      <th className="px-2 py-3 w-[120px]">Nacionalidade</th>
                      <th className="px-2 py-3 w-[100px]">Data Nasc.</th>
                      <th className="px-2 py-3 w-[150px]">RA</th>
                      <th className="px-2 py-3 w-[60px]">UF RA</th>
                      <th className="px-2 py-3 w-[50px] text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {batchData.map((row, i) => (
                      <tr key={i} className="hover:bg-surface-variant/10 group">
                        <td className="p-1"><input type="text" className="w-full bg-transparent p-2 focus:bg-surface-container-highest rounded" value={row.RM} onChange={(e) => updateBatchField(i, 'RM', e.target.value)}/></td>
                        <td className="p-1"><input type="text" className="w-full bg-transparent p-2 focus:bg-surface-container-highest rounded font-semibold" value={row.NOME_ALUNO} onChange={(e) => updateBatchField(i, 'NOME_ALUNO', e.target.value)}/></td>
                        <td className="p-1"><input type="text" className="w-full bg-transparent p-2 focus:bg-surface-container-highest rounded" value={row.MUNICIPIO} onChange={(e) => updateBatchField(i, 'MUNICIPIO', e.target.value)}/></td>
                        <td className="p-1"><input type="text" className="w-full bg-transparent p-2 focus:bg-surface-container-highest rounded" value={row.UF} onChange={(e) => updateBatchField(i, 'UF', e.target.value)}/></td>
                        <td className="p-1"><input type="text" className="w-full bg-transparent p-2 focus:bg-surface-container-highest rounded" value={row.NACION} onChange={(e) => updateBatchField(i, 'NACION', e.target.value)}/></td>
                        <td className="p-1"><input type="text" className="w-full bg-transparent p-2 focus:bg-surface-container-highest rounded" placeholder="DD/MM/AAAA" value={row.DATA_NASCIMENTO} onChange={(e) => updateBatchField(i, 'DATA_NASCIMENTO', e.target.value)}/></td>
                        <td className="p-1"><input type="text" className="w-full bg-transparent p-2 focus:bg-surface-container-highest rounded" value={row.RA} onChange={(e) => updateBatchField(i, 'RA', e.target.value)}/></td>
                        <td className="p-1"><input type="text" className="w-full bg-transparent p-2 focus:bg-surface-container-highest rounded text-primary font-bold" value={row.UF_RA} onChange={(e) => updateBatchField(i, 'UF_RA', e.target.value)}/></td>
                        <td className="p-1 text-center">
                          <button type="button" onClick={() => handleRemoveRow(i)} className="text-secondary hover:text-red-500 opacity-50 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {batchData.length < 200 && (
                <button type="button" onClick={handleAddRow} className="self-end text-xs font-bold text-primary flex items-center gap-1 hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[16px]">add</span> Adicionar Aluno (Nova Linha)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
