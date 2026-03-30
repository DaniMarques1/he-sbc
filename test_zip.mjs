import fs from 'fs';
import PizZip from 'pizzip';

const content = fs.readFileSync('./historicos/template_concluinte.doc', 'binary');
try {
  const zip = new PizZip(content);
  console.log("Files in zip:");
  console.log(Object.keys(zip.files));
} catch (e) {
  console.error("Error reading zip:", e.message);
}
