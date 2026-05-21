"use client";

import { useState, useEffect, useRef } from "react";

const formatRA = (value: string) => {
  const clean = value.replace(/[^0-9Xx]/g, "").slice(0, 10);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)}.${clean.slice(3)}`;
  if (clean.length <= 9) return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`;
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9, 10)}`;
};

const formatDate = (value: string) => {
  if (!value) return "";
  // Check if it's in YYYY-MM-DD format (like "2015-08-25")
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  }
  // Check if it's in YYYY/MM/DD format
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
    const [y, m, d] = value.split("/");
    return `${d}/${m}/${y}`;
  }

  // Otherwise, fallback to typing format (DD/MM/YYYY)
  const clean = value.replace(/\D/g, "").slice(0, 8);
  if (clean.length <= 2) return clean;
  if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`;
};

export function IdentificacaoAluno() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const raRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);

  const emptyStudent = {
    RM: "",
    NOME_ALUNO: "",
    MUNICIPIO: "SÃO BERNARDO DO CAMPO",
    UF: "SP",
    NACION: "BRASILEIRA",
    DATA_NASCIMENTO: "",
    RA: "",
    UF_RA: "SP"
  };
  const [batchData, setBatchData] = useState<any[]>([{ ...emptyStudent }]);

  // Format single RA input value in real-time, preserving cursor position
  useEffect(() => {
    const input = raRef.current;
    if (!input) return;

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const formatted = formatRA(target.value);
      if (target.value !== formatted) {
        const selectionStart = target.selectionStart;
        const selectionEnd = target.selectionEnd;
        const originalLen = target.value.length;

        target.value = formatted;

        if (selectionStart !== null && selectionEnd !== null) {
          const newLen = formatted.length;
          const diff = newLen - originalLen;
          target.setSelectionRange(selectionStart + diff, selectionEnd + diff);
        }
      }
    };

    input.addEventListener("input", handleInput);

    // Format any initial value
    if (input.value) {
      input.value = formatRA(input.value);
    }

    return () => {
      input.removeEventListener("input", handleInput);
    };
  }, [isBatchMode]);

  // Format single Date of Birth input value in real-time, preserving cursor position
  useEffect(() => {
    const input = dobRef.current;
    if (!input) return;

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const formatted = formatDate(target.value);
      if (target.value !== formatted) {
        const selectionStart = target.selectionStart;
        const selectionEnd = target.selectionEnd;
        const originalLen = target.value.length;

        target.value = formatted;

        if (selectionStart !== null && selectionEnd !== null) {
          const newLen = formatted.length;
          const diff = newLen - originalLen;
          target.setSelectionRange(selectionStart + diff, selectionEnd + diff);
        }
      }
    };

    input.addEventListener("input", handleInput);

    // Format any initial value
    if (input.value) {
      input.value = formatDate(input.value);
    }

    return () => {
      input.removeEventListener("input", handleInput);
    };
  }, [isBatchMode]);

  useEffect(() => {
    const handleTemplateLoad = (e: any) => {
      const data = e.detail;
      if (!data) return;

      if (data.isReset) {
        setBatchData([{ ...emptyStudent }]);
        setIsBatchMode(false);
        return;
      }

      if (data["MALA_DIRETA_ENABLED"] === "true") {
        setIsBatchMode(true);
        if (data["ALUNOS_BATCH"]) {
          try {
            const parsedBatch = JSON.parse(data["ALUNOS_BATCH"]);
            if (Array.isArray(parsedBatch) && parsedBatch.length > 0) {
              const formattedBatch = parsedBatch.map((student: any) => ({
                ...student,
                RA: formatRA(student.RA || ""),
                DATA_NASCIMENTO: formatDate(student.DATA_NASCIMENTO || "")
              }));
              setBatchData(formattedBatch);
            }
          } catch (e) {
            console.error("Falha ao analisar o JSON do lote salvo no template.");
          }
        }
      } else {
        setIsBatchMode(false);
        setBatchData([{ ...emptyStudent }]);
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
          DATA_NASCIMENTO: formatDate(cols[5] || ""),
          RA: formatRA(cols[6] || ""),
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
            <div className="flex flex-col gap-6">
              <input type="hidden" name="MALA_DIRETA_ENABLED" value="false" />

              {/* Line 1: Nome Completo / RM */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nome Completo</label>
                  <input type="text" name="NOME_ALUNO" placeholder="Nome Completo" className="bg-surface-container-highest px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-on-surface" />
                </div>
                <div className="md:col-span-1 space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Registro de Matrícula (RM)</label>
                  <input type="text" name="RM" placeholder="RM" className="bg-surface-container-highest px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-on-surface" />
                </div>
              </div>

              {/* Line 2: Data Nasc. / R.A / UF R.A */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Data de Nascimento</label>
                  <input type="text" ref={dobRef} name="DATA_NASCIMENTO" placeholder="DD/MM/AAAA" className="bg-surface-container-highest px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-on-surface" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Registro de Aluno (RA)</label>
                  <input type="text" ref={raRef} name="RA" placeholder="000.000.000-0" className="bg-surface-container-highest px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-on-surface" />
                </div>
                <div className="md:col-span-1 space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">UF do RA</label>
                  <input type="text" name="UF_RA" defaultValue="SP" placeholder="UF" className="bg-surface-container-highest px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-on-surface" />
                </div>
              </div>

              {/* Line 3: Naturalidade / Estado / Nacionalidade */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Naturalidade</label>
                  <input type="text" name="MUNICIPIO" defaultValue="SÃO BERNARDO DO CAMPO" placeholder="Cidade de Nascimento" className="bg-surface-container-highest px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-on-surface" />
                </div>
                <div className="md:col-span-1 space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Estado</label>
                  <input type="text" name="UF" defaultValue="SP" placeholder="UF" className="bg-surface-container-highest px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-on-surface" />
                </div>
                <div className="md:col-span-1 space-y-1">
                  <label className="block text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Nacionalidade</label>
                  <input type="text" name="NACION" defaultValue="BRASILEIRA" placeholder="País de Origem" className="bg-surface-container-highest px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-on-surface" />
                </div>
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
                        <td className="p-1"><input type="text" className="w-full bg-surface-container-highest px-2 py-1.5 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-on-surface" value={row.RM} onChange={(e) => updateBatchField(i, 'RM', e.target.value)} /></td>
                        <td className="p-1"><input type="text" className="w-full bg-surface-container-highest px-2 py-1.5 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-on-surface font-semibold" value={row.NOME_ALUNO} onChange={(e) => updateBatchField(i, 'NOME_ALUNO', e.target.value)} /></td>
                        <td className="p-1"><input type="text" className="w-full bg-surface-container-highest px-2 py-1.5 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-on-surface" value={row.MUNICIPIO} onChange={(e) => updateBatchField(i, 'MUNICIPIO', e.target.value)} /></td>
                        <td className="p-1"><input type="text" className="w-full bg-surface-container-highest px-2 py-1.5 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-on-surface" value={row.UF} onChange={(e) => updateBatchField(i, 'UF', e.target.value)} /></td>
                        <td className="p-1"><input type="text" className="w-full bg-surface-container-highest px-2 py-1.5 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-on-surface" value={row.NACION} onChange={(e) => updateBatchField(i, 'NACION', e.target.value)} /></td>
                        <td className="p-1"><input type="text" className="w-full bg-surface-container-highest px-2 py-1.5 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-on-surface" placeholder="DD/MM/AAAA" value={row.DATA_NASCIMENTO} onChange={(e) => updateBatchField(i, 'DATA_NASCIMENTO', formatDate(e.target.value))} /></td>
                        <td className="p-1"><input type="text" className="w-full bg-surface-container-highest px-2 py-1.5 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-on-surface" value={row.RA} onChange={(e) => updateBatchField(i, 'RA', formatRA(e.target.value))} /></td>
                        <td className="p-1"><input type="text" className="w-full bg-surface-container-highest px-2 py-1.5 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-on-surface text-primary font-bold" value={row.UF_RA} onChange={(e) => updateBatchField(i, 'UF_RA', e.target.value)} /></td>
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
