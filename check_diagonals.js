const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

const templatePath = path.resolve(process.cwd(), 'historicos', 'template_educar_mais.docx');
const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);
const xml = zip.file('word/document.xml').asText();

const temLinhaDiagonal = xml.includes('<w:tl2br');
console.log("Has tl2br natively in template? ", temLinhaDiagonal);

const match = xml.match(/<w:tc[^>]*>[\s\S]*?LÍNGUA ESTRANGEIRA[\s\S]*?<\/w:tr>/);
if (match) console.log("LÍNGUA ESTRANGEIRA row check:", match[0].substring(0, 500));
