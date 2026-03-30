import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const content = fs.readFileSync("./historicos/template_concluinte.doc", "binary");
const zip = new PizZip(content);
const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
console.log("Template Concluinte Text Dump:");
console.log(doc.getFullText().substring(0, 1000)); // just part of it to understand structure

const text = doc.getFullText();
// find where {#disciplinas} is
const index = text.indexOf("{#disciplinas}");
console.log(text.substring(Math.max(0, index - 50), index + 500));
