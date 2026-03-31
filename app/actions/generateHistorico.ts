"use server";

import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export async function generateHistoricoAction(formData: FormData): Promise<{ base64?: string, error?: string, templateName?: string }> {
  try {
    let isEducarMais = false;
    for (let i = 1; i <= 5; i++) {
       if (formData.get(`EDUCARMAIS_${i}`) === "on") isEducarMais = true;
    }
    
    const templateName = isEducarMais ? "template_educar_mais.docx" : "template_concluinte.docx";
    const templatePath = path.resolve(process.cwd(), "historicos", templateName);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template não encontrado: ${templatePath}`);
    }

    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter(part) {
        if (!part.module) return "";
        if (part.module === "rawxml") return "";
        return "";
      }
    });
    
    const data: Record<string, any> = {};
    
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    let transferYear = -1;
    let conclusionYear = -1;
    for (let i = 1; i <= 5; i++) {
        if (formData.get(`TRANSF_${i}`) === "on") transferYear = i;
        if (formData.get(`CONCLUSAO_${i}`) === "on") conclusionYear = i;
    }

    if (conclusionYear === -1 && transferYear === -1) {
        throw new Error("É obrigatório marcar pelo menos um ano como Conclusão ou Transferência no Percurso Acadêmico.");
    }

    if (conclusionYear > 0) {
        data["PROSSEGUIMENTO"] = "próximo ano";
        data["ANO_HISTORICO"] = conclusionYear.toString();
    } else if (transferYear > 0) {
        data["PROSSEGUIMENTO"] = "mesmo ano";
        data["ANO_HISTORICO"] = transferYear.toString();
        
        // Adiciona "Transfere-se" na mesma célula da escola
        let currentEscola = data[`ESCOLA_${transferYear}`] || "";
        if (currentEscola) {
            data[`ESCOLA_${transferYear}`] = currentEscola + " - Transfere-se";
        }

        // Carga horária do ano de transferência é inutilizada
        data[`HORAS_${transferYear}`] = "|MERGE_START_DIAGONAL";
        data[`HMAIS_${transferYear}`] = "|MERGE_START_DIAGONAL";
    }
    
    // Tabela 3 (Percurso) recebe "-" quando está vazio. E a Carga Horária recebe riscado transversal
    const textFields = ['ANO', 'ESCOLA', 'MUNIC', 'UF'];
    for (let i = 1; i <= 5; i++) {
        textFields.forEach(field => {
            if (!formData.has(`${field}_${i}`) || formData.get(`${field}_${i}`)?.toString().trim() === "") {
                if (data[`${field}_${i}`] === undefined) {
                    data[`${field}_${i}`] = "-";
                }
            }
        });
        const horasFields = ['HORAS', 'HMAIS'];
        horasFields.forEach(field => {
            if (!formData.has(`${field}_${i}`) || formData.get(`${field}_${i}`)?.toString().trim() === "") {
                if (data[`${field}_${i}`] === undefined) {
                    data[`${field}_${i}`] = "|MERGE_START_DIAGONAL";
                }
            }
        });
    }

    const disciplinas = [];
    for (let i = 0; i < 13; i++) {
        const nome = formData.get(`disciplina_${i}_nome`)?.toString() || " ";
        let rowObj: Record<string, string> = { nome: nome };
        
        for (let y = 1; y <= 5; y++) {
            const isBlankYear = !formData.has(`ANO_${y}`) || formData.get(`ANO_${y}`)?.toString().trim() === "";
            
            if (isBlankYear) {
                if (i === 0) {
                    rowObj[`nota_${y}`] = " |MERGE_START_DIAGONAL";
                } else {
                    rowObj[`nota_${y}`] = " |MERGE_CONTINUE";
                }
            } else if (y === transferYear) {
                if (i === 0) {
                    rowObj[`nota_${y}`] = "TRANSFERE-SE |MERGE_START_VERT";
                } else {
                    rowObj[`nota_${y}`] = " |MERGE_CONTINUE";
                }
            } else {
                const type = formData.get(`res_type_${y}`);
                if (type === "Resolução") {
                    if (i === 0) {
                        rowObj[`nota_${y}`] = (formData.get(`res_text_${y}`)?.toString() || "Resolução") + " |MERGE_START_VERT";
                    } else {
                        rowObj[`nota_${y}`] = " |MERGE_CONTINUE";
                    }
                } else {
                    rowObj[`nota_${y}`] = formData.get(`disciplina_${i}_nota_${y}`)?.toString() || " ";
                }
            }
        }
        disciplinas.push(rowObj);
    }
    data["disciplinas"] = disciplinas;
    
    const obsListTexts: string[] = [];
    let obsList: { text: string }[] = [];
    for (const key of formData.keys()) {
      if (key.startsWith('obs_title_')) {
        const id = key.replace('obs_title_', '');
        const title = formData.get(`obs_title_${id}`)?.toString() || '';
        const text = formData.get(`obs_text_${id}`)?.toString() || '';
        
        const formattedTitle = title ? `|BOLD_START|${title}|BOLD_END|` : '';
        const combinedText = `${formattedTitle} ${text}`.trim();
        
        obsListTexts.push(combinedText);
        obsList.push({ text: combinedText });
      }
    }
    const obsText = obsListTexts.join('|PARAGRAPH_BREAK|');
    data["OBS"] = obsText || obsList; 
    
    let anoCorrente = new Date().getFullYear().toString();
    if (conclusionYear > 0 && data[`ANO_${conclusionYear}`]) {
        anoCorrente = data[`ANO_${conclusionYear}`];
    } else if (transferYear > 0 && data[`ANO_${transferYear}`]) {
        anoCorrente = data[`ANO_${transferYear}`];
    }
    data["ANO_CORRENTE"] = anoCorrente;
    
    const dataCabecalho = formData.get("DATA_CABECALHO")?.toString() || "";
    if (dataCabecalho) {
        const [yyyy, mm, dd] = dataCabecalho.split("-");
        data["DATA"] = `${dd}/${mm}/${yyyy}`;
    } else {
        data["DATA"] = new Date().toLocaleDateString('pt-BR');
    }
    
    const dataNascimento = data["DATA_NASCIMENTO"] || "";
    if (dataNascimento) {
       const parts = dataNascimento.split('/');
       if (parts.length === 3) {
          data["D_N"] = parts[0];
          data["M_N"] = parts[1];
          data["A_N"] = parts[2];
       }
    }
    
    const isTransfVazio = formData.get("SEM_TRANSF_MEIO_ANO") === "on";
    const transfFields = ['CLASSE', 'TURMA', 'DATA_MATR', 'DATA_TRANSF', 'TURNO', 'CICLO', 'ANO_TRANSF', 'FALTAS', 'DIAS_LET', 'ATE_TRIMESTRE', 'N_CHAMADA'];
    
    if (isTransfVazio) {
        // Campos de cabeçalho ficam vazios (sem risco)
        const headerFields = ['CLASSE', 'TURMA', 'DATA_MATR', 'DATA_TRANSF', 'TURNO', 'CICLO', 'ANO_TRANSF', 'N_CHAMADA'];
        headerFields.forEach(field => {
            data[field] = " ";
        });
        // Campos de resultado/tabela recebem o risco
        const tableFields = ['FALTAS', 'DIAS_LET', 'ATE_TRIMESTRE'];
        tableFields.forEach(field => {
            data[field] = "|MERGE_START_DIAGONAL";
        });
        data["exibirResolucaoTransf1"] = [{ TEXTO_DA_RESOLUCAO_TRANSF1: "|MERGE_START_DIAGONAL" }];
        data["exibirResolucaoTransf2"] = [{ TEXTO_DA_RESOLUCAO_TRANSF2: "|MERGE_START_DIAGONAL" }];
        data["exibirResolucaoTransf3"] = [{ TEXTO_DA_RESOLUCAO_TRANSF3: "|MERGE_START_DIAGONAL" }];
    } else {
        transfFields.forEach(field => {
            data[field] = formData.get(field)?.toString() || " ";
        });
        
        const ateTrimestre = data["ATE_TRIMESTRE"];
        const textoResolucao = formData.get("TEXTO_RESOLUCAO_TRANSF")?.toString().trim() || "Resolução XX";
        
        let show1 = false, show2 = false, show3 = false;
        if (ateTrimestre === "1º Trimestre") { show1 = true; }
        if (ateTrimestre === "2º Trimestre") { show1 = true; show2 = true; }
        if (ateTrimestre === "3º Trimestre") { show1 = true; show2 = true; show3 = true; }

        if (show1) {
            data["exibirResolucaoTransf1"] = [{ TEXTO_DA_RESOLUCAO_TRANSF1: textoResolucao }];
        } else {
            data["exibirResolucaoTransf1"] = [{ TEXTO_DA_RESOLUCAO_TRANSF1: "|MERGE_START_DIAGONAL" }];
        }

        if (show2) {
            data["exibirResolucaoTransf2"] = [{ TEXTO_DA_RESOLUCAO_TRANSF2: textoResolucao }];
        } else {
            data["exibirResolucaoTransf2"] = [{ TEXTO_DA_RESOLUCAO_TRANSF2: "|MERGE_START_DIAGONAL" }];
        }

        if (show3) {
            data["exibirResolucaoTransf3"] = [{ TEXTO_DA_RESOLUCAO_TRANSF3: textoResolucao }];
        } else {
            data["exibirResolucaoTransf3"] = [{ TEXTO_DA_RESOLUCAO_TRANSF3: "|MERGE_START_DIAGONAL" }];
        }
    }
    
    doc.render(data);

    // Mágica do XML: Mesclar as células de Resolução Verticalmente e Limpar as bordas horizontais cruzadas
    const xmlFile = doc.getZip().file("word/document.xml");
    if (xmlFile) {
        let xml = xmlFile.asText();

        // 1) Onde for START_VERT: marca a célula para iniciar a mesclagem vertical
        xml = xml.replace(
            /<w:tc>(?:(?!<\/w:tc>)[\s\S])*?\|MERGE_START_VERT(?:(?!<\/w:tc>)[\s\S])*?<\/w:tc>/g,
            (match) => {
                let m = match.replace(/\|MERGE_START_VERT/g, "");
                m = m.replace(/<w:tcPr>([\s\S]*?)<\/w:tcPr>/, (tcPrMatch, inner) => {
                    let n = inner.replace(/<w:vMerge[^>]*>/g, "");
                    n = n.replace(/<w:tcBorders>[\s\S]*?<\/w:tcBorders>/g, "");
                    n = n.replace(/<w:textDirection[^>]*>/g, "");
                    n = n.replace(/<w:vAlign[^>]*>/g, "");
                    return `<w:tcPr>${n}<w:vMerge w:val="restart"/><w:tcBorders><w:top w:val="nil"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="nil"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders><w:textDirection w:val="btLr"/><w:vAlign w:val="center"/></w:tcPr>`;
                });
                return m;
            }
        );

        // 2) Onde for CONTINUE: apaga TUDO que houver e mescla a célula junto a de cima.
        xml = xml.replace(
            /<w:tc>(?:(?!<\/w:tc>)[\s\S])*?\|MERGE_CONTINUE(?:(?!<\/w:tc>)[\s\S])*?<\/w:tc>/g,
            (match) => {
                let m = match;
                m = m.replace(/<w:tcPr>([\s\S]*?)<\/w:tcPr>/, (tcPrMatch, inner) => {
                    let n = inner.replace(/<w:vMerge[^>]*>/g, "");
                    n = n.replace(/<w:tcBorders>[\s\S]*?<\/w:tcBorders>/g, "");
                    n = n.replace(/<w:vAlign[^>]*>/g, "");
                    // Limpamos bordas tb, e injetamos vMerge plain
                    return `<w:tcPr>${n}<w:vMerge/><w:tcBorders><w:top w:val="nil"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="nil"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders><w:vAlign w:val="center"/></w:tcPr>`;
                });
                
                let tcPrEnd = m.indexOf("</w:tcPr>");
                if (tcPrEnd !== -1) {
                    let tcPr = m.substring(0, tcPrEnd + 9);
                    return `${tcPr}<w:p><w:pPr><w:jc w:val="center"/></w:pPr></w:p></w:tc>`;
                }
                return m;
            }
        );

        // 3) START_DIAGONAL: Risco Transversal, limpando conteúdo e forçando merge restart
        xml = xml.replace(
            /<w:tc>(?:(?!<\/w:tc>)[\s\S])*?\|MERGE_START_DIAGONAL(?:(?!<\/w:tc>)[\s\S])*?<\/w:tc>/g,
            (match) => {
                let m = match.replace(/\|MERGE_START_DIAGONAL/g, "");
                m = m.replace(/<w:tcPr>([\s\S]*?)<\/w:tcPr>/, (tcPrMatch, inner) => {
                    let n = inner.replace(/<w:vMerge[^>]*>/g, "");
                    if (n.indexOf("<w:tcBorders>") !== -1) {
                        let b = n.replace(/<\/w:tcBorders>/, '<w:tl2br w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders>');
                        return `<w:tcPr>${b}<w:vMerge w:val="restart"/></w:tcPr>`;
                    } else {
                        return `<w:tcPr>${n}<w:tcBorders><w:tl2br w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders><w:vMerge w:val="restart"/></w:tcPr>`;
                    }
                });
                
                let tcPrEnd = m.indexOf("</w:tcPr>");
                if (tcPrEnd !== -1) {
                    let tcPr = m.substring(0, tcPrEnd + 9);
                    return `${tcPr}<w:p><w:pPr><w:jc w:val="center"/></w:pPr></w:p></w:tc>`;
                }
                return m;
            }
        );

        // 4) Transformar pseudo-tags de negrito geradas nas observações
        xml = xml.replace(
            /<w:r(?:.*?)>([\s\S]*?)<\/w:r>/g,
            (match) => {
                if (match.includes("|BOLD_START|")) {
                    let rPr = "";
                    const prMatch = match.match(/<w:rPr>[\s\S]*?<\/w:rPr>/);
                    if (prMatch) rPr = prMatch[0];
                    
                    let boldRPr = rPr ? rPr.replace("</w:rPr>", "<w:b/><w:bCs/></w:rPr>") : "<w:rPr><w:b/><w:bCs/></w:rPr>";
                    
                    return match.replace(
                        /\|BOLD_START\|(.*?)\|BOLD_END\|/g,
                        `</w:t></w:r><w:r>${boldRPr}<w:t xml:space="preserve">$1</w:t></w:r><w:r>${rPr}<w:t xml:space="preserve">`
                    );
                }
                return match;
            }
        );

        // 5) Quebras de parágrafo reais para evitar esticar texto justificado
        xml = xml.replace(
            /<w:p(?:(?!<w:p>)[^>])*>([\s\S]*?)<\/w:p>/g,
            (match) => {
                if (match.includes("|PARAGRAPH_BREAK|")) {
                    let pPr = "";
                    const pPrMatch = match.match(/<w:pPr>[\s\S]*?<\/w:pPr>/);
                    if (pPrMatch) pPr = pPrMatch[0];

                    let newMatch = match;
                    newMatch = newMatch.replace(
                        /<w:r(?:(?!<w:r>)[^>])*>([\s\S]*?)<\/w:r>/g,
                        (rMatch) => {
                            if (rMatch.includes("|PARAGRAPH_BREAK|")) {
                                let rPr = "";
                                const rPrMatch = rMatch.match(/<w:rPr>[\s\S]*?<\/w:rPr>/);
                                if (rPrMatch) rPr = rPrMatch[0];
                                
                                return rMatch.replace(
                                    /\|PARAGRAPH_BREAK\|/g,
                                    `</w:t></w:r></w:p><w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">`
                                );
                            }
                            return rMatch;
                        }
                    );
                    return newMatch;
                }
                return match;
            }
        );

        // 6) Transformar tags HTML <b>, <i> escritas pelo usuário nas observações
        xml = xml.replace(
            /<w:p(?:(?!<w:p>)[^>])*>([\s\S]*?)<\/w:p>/gi,
            (pMatch) => {
                let htmlbold = false;
                let htmlitalic = false;

                return pMatch.replace(
                    /<w:r(?:(?!<w:r>)[^>])*>([\s\S]*?)<\/w:r>/gi,
                    (rMatch) => {
                        // Extract base properties
                        let rOpenMatch = rMatch.match(/^<w:r(?:(?:(?!<w:r>)[^>])*)>/);
                        let rOpen = rOpenMatch ? rOpenMatch[0] : "<w:r>";
                        
                        let rPr = "";
                        const rPrMatch = rMatch.match(/<w:rPr>[\s\S]*?<\/w:rPr>/);
                        if (rPrMatch) rPr = rPrMatch[0];

                        // Se não tem as tags, podemos apenas atualizar o estilo do rPr se htmlbold for true
                        if (!rMatch.match(/&lt;\/?(?:b|i)&gt;/i)) {
                            if (htmlbold || htmlitalic) {
                                let styleAdds = "";
                                if (htmlbold) styleAdds += "<w:b/><w:bCs/>";
                                if (htmlitalic) styleAdds += "<w:i/><w:iCs/>";
                                
                                let currentRPr = rPr;
                                if (currentRPr) {
                                    currentRPr = currentRPr.replace("</w:rPr>", `${styleAdds}</w:rPr>`);
                                    return rMatch.replace(/<w:rPr>[\s\S]*?<\/w:rPr>/, currentRPr);
                                } else {
                                    currentRPr = `<w:rPr>${styleAdds}</w:rPr>`;
                                    return rMatch.replace(/^<w:r(?:(?:(?!<w:r>)[^>])*)>/, `$&${currentRPr}`);
                                }
                            }
                            return rMatch;
                        }

                        // Se tem tags, precisamos dividir o conteúdo interno
                        let innerContent = rMatch.replace(rOpen, "").replace(/<\/w:r>$/, "");
                        if (rPr) innerContent = innerContent.replace(rPr, "");

                        let replacementRuns = [];
                        let tokens = innerContent.split(/(<w:t(?:[^>]*)>[\s\S]*?<\/w:t>)/g);
                        
                        for (let token of tokens) {
                            if (!token) continue;
                            
                            if (token.startsWith("<w:t")) {
                                let tMatch = token.match(/<w:t([^>]*)>([\s\S]*?)<\/w:t>/);
                                if (!tMatch) continue;
                                let tAttrs = tMatch[1];
                                let tInner = tMatch[2];
                                
                                let parts = tInner.split(/(&lt;\/?(?:b|i)&gt;)/i);
                                for (let p of parts) {
                                    if (!p) continue;
                                    let lp = p.toLowerCase();
                                    if (lp === '&lt;b&gt;') { htmlbold = true; continue; }
                                    if (lp === '&lt;/b&gt;') { htmlbold = false; continue; }
                                    if (lp === '&lt;i&gt;') { htmlitalic = true; continue; }
                                    if (lp === '&lt;/i&gt;') { htmlitalic = false; continue; }

                                    let styleAdds = "";
                                    if (htmlbold) styleAdds += "<w:b/><w:bCs/>";
                                    if (htmlitalic) styleAdds += "<w:i/><w:iCs/>";
                                    
                                    let currentRPr = rPr;
                                    if (styleAdds) {
                                        if (currentRPr) currentRPr = currentRPr.replace("</w:rPr>", `${styleAdds}</w:rPr>`);
                                        else currentRPr = `<w:rPr>${styleAdds}</w:rPr>`;
                                    }

                                    replacementRuns.push(`${rOpen}${currentRPr}<w:t${tAttrs}>${p}</w:t></w:r>`);
                                }
                            } else {
                                let styleAdds = "";
                                if (htmlbold) styleAdds += "<w:b/><w:bCs/>";
                                if (htmlitalic) styleAdds += "<w:i/><w:iCs/>";
                                
                                let currentRPr = rPr;
                                if (styleAdds) {
                                    if (currentRPr) currentRPr = currentRPr.replace("</w:rPr>", `${styleAdds}</w:rPr>`);
                                    else currentRPr = `<w:rPr>${styleAdds}</w:rPr>`;
                                }

                                replacementRuns.push(`${rOpen}${currentRPr}${token}</w:r>`);
                            }
                        }
                        
                        return replacementRuns.join("");
                    }
                );
            }
        );

        doc.getZip().file("word/document.xml", xml);
    }

    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
    
    return { base64: buf.toString("base64"), templateName };
  } catch (error: any) {
    return { error: error.message };
  }
}
