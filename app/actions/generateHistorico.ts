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

    if (conclusionYear > 0) {
        data["PROSSEGUIMENTO"] = "próximo ano";
    } else if (transferYear > 0) {
        data["PROSSEGUIMENTO"] = "mesmo ano";
        
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
    
    const obsList: { text: string }[] = [];
    let obsText = "";
    for (const key of formData.keys()) {
      if (key.startsWith('obs_title_')) {
        const id = key.replace('obs_title_', '');
        const title = formData.get(`obs_title_${id}`)?.toString() || '';
        const text = formData.get(`obs_text_${id}`)?.toString() || '';
        obsText += `${title} ${text}\n`;
        obsList.push({ text: `${title} ${text}` });
      }
    }
    data["OBS"] = obsText.trim() ? obsText : obsList; 
    data["ANO_CORRENTE"] = new Date().getFullYear().toString();
    data["DATA"] = new Date().toLocaleDateString('pt-BR');
    
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
    const transfFields = ['CLASSE', 'TURMA', 'DATA_MATR', 'DATA_TRANSF', 'TURNO', 'CICLO', 'ANO_TRANSF', 'FALTAS', 'DIAS_LET', 'ATE_TRIMESTRE'];
    
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
        data["exibirResolucaoTransf"] = [{ TEXTO_DA_RESOLUCAO_TRANSF: "|MERGE_START_DIAGONAL" }];
    } else {
        transfFields.forEach(field => {
            data[field] = formData.get(field)?.toString() || " ";
        });
        
        if (data["ATE_TRIMESTRE"]) {
            data["exibirResolucaoTransf"] = [{ TEXTO_DA_RESOLUCAO_TRANSF: `Até o ${data["ATE_TRIMESTRE"]}` }];
        } else {
            data["exibirResolucaoTransf"] = [];
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
