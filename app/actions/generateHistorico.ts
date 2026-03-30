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
    
    const disciplinas = [];
    for (let i = 0; i < 13; i++) {
        const nome = formData.get(`disciplina_${i}_nome`)?.toString() || " ";
        let rowObj: Record<string, string> = { nome: nome };
        
        for (let y = 1; y <= 5; y++) {
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
    
    if (data["ATE_TRIMESTRE"]) {
        data["exibirResolucaoTransf"] = [{ TEXTO_DA_RESOLUCAO_TRANSF: `Até o ${data["ATE_TRIMESTRE"]}` }];
    } else {
        data["exibirResolucaoTransf"] = [];
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
                    return `<w:tcPr>${n}<w:vMerge/><w:tcBorders><w:top w:val="nil"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="nil"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders><w:vAlign w:val="center"/></w:tcPr>`;
                });
                
                let tcPrEnd = m.indexOf("</w:tcPr>");
                if (tcPrEnd !== -1) {
                    let tcPr = m.substring(0, tcPrEnd + 9);
                    // Deixa a célula completamente vazia visualmente
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
