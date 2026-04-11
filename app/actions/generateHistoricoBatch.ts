"use server";

import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export async function generateHistoricoBatchAction(formData: FormData, alunosBatch: any[]): Promise<{ status: string, base64?: string, error?: string }> {
    try {
        if (!alunosBatch || alunosBatch.length === 0) {
            throw new Error("O lote de alunos está vazio.");
        }

        let isEducarMais = false;
        for (let i = 1; i <= 5; i++) {
            if (formData.get(`EDUCARMAIS_${i}`) === "on") isEducarMais = true;
        }

        const templateName = isEducarMais ? "template_educar_mais.docx" : "template_concluinte.docx";
        const templatePath = path.resolve(process.cwd(), "historicos", templateName);

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template não encontrado: ${templatePath}`);
        }

        const templateContent = fs.readFileSync(templatePath, "binary");

        // Parse formData para objeto JS básico
        const baseData: Record<string, any> = {};
        formData.forEach((value, key) => {
            baseData[key] = value.toString();
        });

        // Configurações base do percurso (não muda por aluno)
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
            baseData["PROSSEGUIMENTO"] = "próximo ano";
            baseData["ANO_HISTORICO"] = conclusionYear.toString();
        } else if (transferYear > 0) {
            baseData["PROSSEGUIMENTO"] = "mesmo ano";
            baseData["ANO_HISTORICO"] = transferYear.toString();
            let currentEscola = baseData[`ESCOLA_${transferYear}`] || "";
            if (currentEscola) {
                baseData[`ESCOLA_${transferYear}`] = currentEscola + " - Transfere-se";
            }
            baseData[`HORAS_${transferYear}`] = "-";
        }

        const textFields = ['ANO', 'ESCOLA', 'MUNIC', 'UF'];
        for (let i = 1; i <= 5; i++) {
            textFields.forEach(field => {
                if (!formData.has(`${field}_${i}`) || formData.get(`${field}_${i}`)?.toString().trim() === "") {
                    if (baseData[`${field}_${i}`] === undefined) {
                        baseData[`${field}_${i}`] = "-";
                    }
                }
            });
            const horasFields = ['HORAS', 'HMAIS'];
            horasFields.forEach(field => {
                if (!formData.has(`${field}_${i}`) || formData.get(`${field}_${i}`)?.toString().trim() === "") {
                    if (baseData[`${field}_${i}`] === undefined) {
                        baseData[`${field}_${i}`] = "-";
                    }
                }
            });

            const isBlankYear = !formData.has(`ANO_${i}`) || formData.get(`ANO_${i}`)?.toString().trim() === "";
            const isEm = formData.get(`EDUCARMAIS_${i}`) === "on";

            if (isEm && !isBlankYear) {
                baseData[`RES_EDUCARMAIS_${i}`] = "||CLEAR_DIAG||Resolução SE nº 21/2017 – Programa Educar Mais";
                let hmaisVal = formData.get(`HMAIS_${i}`)?.toString().trim() || " ";
                baseData[`HMAIS_${i}`] = "||CLEAR_DIAG||" + hmaisVal;
            } else {
                baseData[`RES_EDUCARMAIS_${i}`] = "|MERGE_START_DIAGONAL";
                if (!isBlankYear) {
                    baseData[`HMAIS_${i}`] = "-";
                }
            }
        }

        const disciplinas = [];
        for (let i = 0; i < 13; i++) {
            const nome = formData.get(`disciplina_${i}_nome`)?.toString() || " ";
            let rowObj: Record<string, string> = { nome: nome };
            for (let y = 1; y <= 5; y++) {
                const isBlankYear = !formData.has(`ANO_${y}`) || formData.get(`ANO_${y}`)?.toString().trim() === "";
                if (isBlankYear) {
                    if (i === 0) rowObj[`nota_${y}`] = " |MERGE_START_DIAGONAL";
                    else rowObj[`nota_${y}`] = " |MERGE_CONTINUE";
                } else if (y === transferYear) {
                    if (i === 0) rowObj[`nota_${y}`] = "|BOLD_START|TRANSFERE-SE|BOLD_END| |MERGE_START_VERT";
                    else rowObj[`nota_${y}`] = " |MERGE_CONTINUE";
                } else {
                    const type = formData.get(`res_type_${y}`);
                    if (type === "Resolução") {
                        if (i === 0) {
                            const resText = formData.get(`res_text_${y}`)?.toString() || "Resolução";
                            rowObj[`nota_${y}`] = `|BOLD_START|${resText}|BOLD_END| |MERGE_START_VERT`;
                        } else {
                            rowObj[`nota_${y}`] = " |MERGE_CONTINUE";
                        }
                    } else {
                        const nota = formData.get(`disciplina_${i}_nota_${y}`)?.toString() || " ";
                        rowObj[`nota_${y}`] = nota.trim() ? `|BOLD_START|${nota}|BOLD_END|` : " ";
                    }
                }
            }
            disciplinas.push(rowObj);
        }
        baseData["disciplinas"] = disciplinas;

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
        baseData["OBS"] = obsListTexts.join('|PARAGRAPH_BREAK|') || obsList;

        let anoCorrente = new Date().getFullYear().toString();
        if (conclusionYear > 0 && baseData[`ANO_${conclusionYear}`]) anoCorrente = baseData[`ANO_${conclusionYear}`];
        else if (transferYear > 0 && baseData[`ANO_${transferYear}`]) anoCorrente = baseData[`ANO_${transferYear}`];
        baseData["ANO_CORRENTE"] = anoCorrente;

        const cargoResp = formData.get("CARGO_RESPONSAVEL")?.toString().trim() || "Diretor(a) Escolar";
        const nomeResp = formData.get("NOME_RESPONSAVEL")?.toString().trim();
        const matResp = formData.get("MATRICULA_RESPONSAVEL")?.toString().trim();
        const assinaturaLinhas = [];
        if (nomeResp) assinaturaLinhas.push(nomeResp);
        if (matResp) assinaturaLinhas.push(matResp);
        assinaturaLinhas.push(cargoResp);
        baseData["ASSINATURA_RESPONSAVEL"] = assinaturaLinhas.join("\n");

        const dataCabecalho = formData.get("DATA_CABECALHO")?.toString() || "";
        if (dataCabecalho) {
            const [yyyy, mm, dd] = dataCabecalho.split("-");
            baseData["DATA"] = `${dd}/${mm}/${yyyy}`;
        } else {
            baseData["DATA"] = new Date().toLocaleDateString('pt-BR');
        }

        const isTransfVazio = formData.get("SEM_TRANSF_MEIO_ANO") === "on";
        const transfFields = ['CLASSE', 'TURMA', 'DATA_MATR', 'DATA_TRANSF', 'TURNO', 'CICLO', 'ANO_TRANSF', 'FALTAS', 'DIAS_LET', 'ATE_TRIMESTRE', 'N_CHAMADA'];
        if (isTransfVazio) {
            const headerFields = ['CLASSE', 'TURMA', 'DATA_MATR', 'DATA_TRANSF', 'TURNO', 'CICLO', 'ANO_TRANSF', 'N_CHAMADA'];
            headerFields.forEach(field => baseData[field] = " ");
            const tableFields = ['FALTAS', 'DIAS_LET', 'ATE_TRIMESTRE'];
            tableFields.forEach(field => baseData[field] = "|MERGE_START_DIAGONAL");
            baseData["exibirResolucaoTransf1"] = [{ TEXTO_DA_RESOLUCAO_TRANSF1: "|MERGE_START_DIAGONAL" }];
            baseData["exibirResolucaoTransf2"] = [{ TEXTO_DA_RESOLUCAO_TRANSF2: "|MERGE_START_DIAGONAL" }];
            baseData["exibirResolucaoTransf3"] = [{ TEXTO_DA_RESOLUCAO_TRANSF3: "|MERGE_START_DIAGONAL" }];
        } else {
            transfFields.forEach(field => baseData[field] = formData.get(field)?.toString() || " ");
            const ateTrimestre = baseData["ATE_TRIMESTRE"];
            const textoResolucao = formData.get("TEXTO_RESOLUCAO_TRANSF")?.toString().trim() || "Resolução XX";
            const textoResolucaoBold = `|BOLD_START|${textoResolucao}|BOLD_END|`;
            
            let show1 = false, show2 = false, show3 = false;
            if (ateTrimestre === "1º Trimestre") show1 = true;
            if (ateTrimestre === "2º Trimestre") { show1 = true; show2 = true; }
            if (ateTrimestre === "3º Trimestre") { show1 = true; show2 = true; show3 = true; }
            
            baseData["exibirResolucaoTransf1"] = [{ TEXTO_DA_RESOLUCAO_TRANSF1: show1 ? textoResolucaoBold : "|MERGE_START_DIAGONAL" }];
            baseData["exibirResolucaoTransf2"] = [{ TEXTO_DA_RESOLUCAO_TRANSF2: show2 ? textoResolucaoBold : "|MERGE_START_DIAGONAL" }];
            baseData["exibirResolucaoTransf3"] = [{ TEXTO_DA_RESOLUCAO_TRANSF3: show3 ? textoResolucaoBold : "|MERGE_START_DIAGONAL" }];
        }

        let masterZip: PizZip | null = null;
        let masterXML = "";

        // Helper genérico para capturar XML otimizado de 1 render
        const processDocxXML = (alunoData: Record<string, any>) => {
            const zip = new PizZip(templateContent);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                nullGetter: (part) => ""
            });

            doc.render(alunoData);

            const xmlFile = doc.getZip().file("word/document.xml");
            if (!xmlFile) return { zip, xml: "" };

            let xml = xmlFile.asText();
            
            // 0 a 6: Todas as Transformações da Tabela e Observações
            xml = xml.replace(/<w:tc(?:(?:(?!<\/w:tc>)[\s\S])*?)\|\|CLEAR_DIAG\|\|(?:(?:(?!<\/w:tc>)[\s\S])*?)<\/w:tc>/g, (m) => m.replace(/\|\|CLEAR_DIAG\|\|/g, "").replace(/<w:tl2br[^>]*>/g, ""));
            xml = xml.replace(/<w:tc>(?:(?!<\/w:tc>)[\s\S])*?\|MERGE_START_VERT(?:(?!<\/w:tc>)[\s\S])*?<\/w:tc>/g, (m) => {
                return m.replace(/\|MERGE_START_VERT/g, "").replace(/<w:tcPr>([\s\S]*?)<\/w:tcPr>/, (_, inner) => {
                    let n = inner.replace(/<w:vMerge[^>]*>/g, "").replace(/<w:tcBorders>[\s\S]*?<\/w:tcBorders>/g, "").replace(/<w:textDirection[^>]*>/g, "").replace(/<w:vAlign[^>]*>/g, "");
                    return `<w:tcPr>${n}<w:vMerge w:val="restart"/><w:tcBorders><w:top w:val="nil"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="nil"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders><w:textDirection w:val="btLr"/><w:vAlign w:val="center"/></w:tcPr>`;
                });
            });
            xml = xml.replace(/<w:tc>(?:(?!<\/w:tc>)[\s\S])*?\|MERGE_CONTINUE(?:(?!<\/w:tc>)[\s\S])*?<\/w:tc>/g, (m) => {
                let newM = m.replace(/<w:tcPr>([\s\S]*?)<\/w:tcPr>/, (_, inner) => {
                    let n = inner.replace(/<w:vMerge[^>]*>/g, "").replace(/<w:tcBorders>[\s\S]*?<\/w:tcBorders>/g, "").replace(/<w:vAlign[^>]*>/g, "");
                    return `<w:tcPr>${n}<w:vMerge/><w:tcBorders><w:top w:val="nil"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="nil"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders><w:vAlign w:val="center"/></w:tcPr>`;
                });
                let tcpEnd = newM.indexOf("</w:tcPr>");
                if (tcpEnd !== -1) return `${newM.substring(0, tcpEnd + 9)}<w:p><w:pPr><w:jc w:val="center"/></w:pPr></w:p></w:tc>`;
                return newM;
            });
            xml = xml.replace(/<w:tc>(?:(?!<\/w:tc>)[\s\S])*?\|MERGE_START_DIAGONAL(?:(?!<\/w:tc>)[\s\S])*?<\/w:tc>/g, (m) => {
                let newM = m.replace(/\|MERGE_START_DIAGONAL/g, "").replace(/<w:tcPr>([\s\S]*?)<\/w:tcPr>/, (_, inner) => {
                    let n = inner.replace(/<w:vMerge[^>]*>/g, "");
                    if (n.indexOf("<w:tcBorders>") !== -1) return `<w:tcPr>${n.replace(/<\/w:tcBorders>/, '<w:tl2br w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders>')}<w:vMerge w:val="restart"/></w:tcPr>`;
                    return `<w:tcPr>${n}<w:tcBorders><w:tl2br w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders><w:vMerge w:val="restart"/></w:tcPr>`;
                });
                let tcpEnd = newM.indexOf("</w:tcPr>");
                if (tcpEnd !== -1) return `${newM.substring(0, tcpEnd + 9)}<w:p><w:pPr><w:jc w:val="center"/></w:pPr></w:p></w:tc>`;
                return newM;
            });
            xml = xml.replace(/<w:r(?:.*?)>([\s\S]*?)<\/w:r>/g, (m) => {
                if (m.includes("|BOLD_START|")) {
                    let rPr = ""; const pMatch = m.match(/<w:rPr>[\s\S]*?<\/w:rPr>/); if (pMatch) rPr = pMatch[0];
                    let bRPr = rPr ? rPr.replace("</w:rPr>", "<w:b/><w:bCs/></w:rPr>") : "<w:rPr><w:b/><w:bCs/></w:rPr>";
                    return m.replace(/\|BOLD_START\|(.*?)\|BOLD_END\|/g, `</w:t></w:r><w:r>${bRPr}<w:t xml:space="preserve">$1</w:t></w:r><w:r>${rPr}<w:t xml:space="preserve">`);
                }
                return m;
            });
            xml = xml.replace(/<w:p(?:(?!<w:p>)[^>])*>([\s\S]*?)<\/w:p>/g, (m) => {
                if (m.includes("|PARAGRAPH_BREAK|")) {
                    let pPr = ""; const pMatch = m.match(/<w:pPr>[\s\S]*?<\/w:pPr>/); if (pMatch) pPr = pMatch[0];
                    return m.replace(/<w:r(?:(?!<w:r>)[^>])*>([\s\S]*?)<\/w:r>/g, (rM) => {
                        if (rM.includes("|PARAGRAPH_BREAK|")) {
                            let rPr = ""; const rMatch = rM.match(/<w:rPr>[\s\S]*?<\/w:rPr>/); if (rMatch) rPr = rMatch[0];
                            return rM.replace(/\|PARAGRAPH_BREAK\|/g, `</w:t></w:r></w:p><w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">`);
                        }
                        return rM;
                    });
                }
                return m;
            });
            xml = xml.replace(/<w:p(?:(?!<w:p>)[^>])*>([\s\S]*?)<\/w:p>/gi, (pM) => {
                let b = false, i = false;
                return pM.replace(/<w:r(?:(?!<w:r>)[^>])*>([\s\S]*?)<\/w:r>/gi, (rM) => {
                    let rOp = rM.match(/^<w:r(?:(?:(?!<w:r>)[^>])*)>/)?.[0] || "<w:r>";
                    let rPr = rM.match(/<w:rPr>[\s\S]*?<\/w:rPr>/)?.[0] || "";
                    if (!rM.match(/&lt;\/?(?:b|i)&gt;/i)) {
                        if (b || i) {
                            let sa = (b ? "<w:b/><w:bCs/>" : "") + (i ? "<w:i/><w:iCs/>" : "");
                            return rPr ? rM.replace(/<w:rPr>[\s\S]*?<\/w:rPr>/, rPr.replace("</w:rPr>", `${sa}</w:rPr>`)) : rM.replace(/^<w:r(?:(?:(?!<w:r>)[^>])*)>/, `$&<w:rPr>${sa}</w:rPr>`);
                        }
                        return rM;
                    }
                    let ic = rM.replace(rOp, "").replace(/<\/w:r>$/, "").replace(rPr, "");
                    let res = [];
                    for (let t of ic.split(/(<w:t(?:[^>]*)>[\s\S]*?<\/w:t>)/g)) {
                        if (!t) continue;
                        if (t.startsWith("<w:t")) {
                            let tm = t.match(/<w:t([^>]*)>([\s\S]*?)<\/w:t>/);
                            if (!tm) continue;
                            for (let p of tm[2].split(/(&lt;\/?(?:b|i)&gt;)/i)) {
                                if (!p) continue;
                                let lp = p.toLowerCase();
                                if (lp === '&lt;b&gt;') { b = true; continue; }
                                if (lp === '&lt;/b&gt;') { b = false; continue; }
                                if (lp === '&lt;i&gt;') { i = true; continue; }
                                if (lp === '&lt;/i&gt;') { i = false; continue; }
                                let sa = (b ? "<w:b/><w:bCs/>" : "") + (i ? "<w:i/><w:iCs/>" : "");
                                let nr = rPr ? rPr.replace("</w:rPr>", `${sa}</w:rPr>`) : (sa ? `<w:rPr>${sa}</w:rPr>` : "");
                                res.push(`${rOp}${nr}<w:t${tm[1]}>${p}</w:t></w:r>`);
                            }
                        } else {
                            let sa = (b ? "<w:b/><w:bCs/>" : "") + (i ? "<w:i/><w:iCs/>" : "");
                            let nr = rPr ? rPr.replace("</w:rPr>", `${sa}</w:rPr>`) : (sa ? `<w:rPr>${sa}</w:rPr>` : "");
                            res.push(`${rOp}${nr}${t}</w:r>`);
                        }
                    }
                    return res.join("");
                });
            });

            return { zip, xml };
        };

        for (let i = 0; i < alunosBatch.length; i++) {
            const aluno = alunosBatch[i];
            const alunoData = { ...baseData, ...aluno };

            const dataNascimento = alunoData["DATA_NASCIMENTO"] || "";
            if (dataNascimento) {
                const parts = dataNascimento.split('/');
                if (parts.length === 3) {
                    alunoData["D_N"] = parts[0];
                    alunoData["M_N"] = parts[1];
                    alunoData["A_N"] = parts[2];
                }
            }

            const { zip, xml } = processDocxXML(alunoData);
            
            if (i === 0) {
                // O primeiro aluno define o XML Master e o Master Zip!
                masterZip = zip;
                masterXML = xml;
            } else {
                // A partir do segundo aluno, nós "roubamos" o conteúdo do Body dele
                // e concatenamos no Master XML, separando com uma quebra de página bruta!
                const bodyMatch = xml.match(/<w:body>([\s\S]*?)<w:sectPr/m);
                if (bodyMatch && bodyMatch[1]) {
                    const extractedContent = bodyMatch[1];
                    // Injeta a quebra de página e o conteúdo extra imediatamente antes da finalização do Doc(sectPr)
                    masterXML = masterXML.replace(
                        /<w:sectPr/m,
                        `<w:p><w:r><w:br w:type="page"/></w:r></w:p>${extractedContent}<w:sectPr`
                    );
                }
            }
        }

        if (masterZip && masterXML) {
            masterZip.file("word/document.xml", masterXML);
            const finalBuffer = masterZip.generate({ type: "nodebuffer", compression: "DEFLATE" });
            const finalBase64 = finalBuffer.toString("base64");


            return { status: "ok", base64: finalBase64 };
        }

        throw new Error("Erro desconhecido ao processar o masterXML");

    } catch (error: any) {
        return { status: "error", error: error.message };
    }
}
