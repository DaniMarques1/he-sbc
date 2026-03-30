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
        disciplinas.push({
           nome: nome
        });
    }
    data["disciplinas"] = disciplinas;

    for (let y = 1; y <= 5; y++) {
        const type = formData.get(`res_type_${y}`);
        if (type === "Resolução") {
            const resText = formData.get(`res_text_${y}`)?.toString() || "";
            data[`exibirNotas_${y}`] = false;
            data[`exibirResolucao_${y}`] = [{ TEXTO_DA_RESOLUCAO: resText }];
        } else {
            const notasAno = [];
            for (let i = 0; i < 13; i++) {
                let nota = formData.get(`disciplina_${i}_nota_${y}`)?.toString() || " ";
                notasAno.push({ nota: nota });
            }
            data[`exibirNotas_${y}`] = [{ disciplinas: notasAno }];
            data[`exibirResolucao_${y}`] = false;
        }
    }
    
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
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
    
    return { base64: buf.toString("base64"), templateName };
  } catch (error: any) {
    return { error: error.message };
  }
}
