const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

try {
  const content = fs.readFileSync("./historicos/template_concluinte.docx", "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  fs.writeFileSync("template_text.txt", doc.getFullText(), 'utf-8');
} catch(e) {
  console.error("Error:", e);
}
