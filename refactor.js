const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  let content = fs.readFileSync(path.join(componentsDir, file), 'utf8');

  // Convert p tags in SchoolData and similar
  content = content.replace(
    /<p className="([^"]+)">([^<]+)<\/p>/g,
    `<input type="text" defaultValue="$2" className="$1 bg-transparent w-full focus:outline-none" />`
  );

  // Convert div tags containing text in StudentData
  // We look for divs inside space-y-1 matching <div className="... px-3 py-2 ...">Text</div>
  content = content.replace(
    /<div className="([^"]*bg-surface-container-highest[^"]*)">([^<]+)<\/div>/g,
    `<input type="text" defaultValue="$2" className="$1 w-full focus:outline-none focus:ring-1 focus:ring-primary bg-transparent" />`
  );

  // Convert td texts in AcademicPath and ResultsTable
  // Look for <td className="...">Text</td>
  content = content.replace(
    /<td className="px-([0-9]+) py-([0-9]+)([^"]*)">([^<]+)<\/td>/g,
    (match, px, py, extraClasses, text) => {
      // Don't replace if it already contains an input or span
      if (text.includes('<')) return match;
      return `<td className="px-${px} py-${py}${extraClasses}">
        <input type="text" defaultValue="${text.trim()}" className="w-full bg-transparent focus:outline-none focus:border-b border-primary/30" />
      </td>`;
    }
  );

  // Convert span tags used as grades
  content = content.replace(
    /<td className="px-6 py-3 text-center">\s*<span className="([^"]+)">([^<]+)<\/span>\s*<\/td>/g,
    `<td className="px-6 py-3 text-center">\n                    <input type="text" defaultValue="$2" className="$1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-primary outline-none" />\n                  </td>`
  );

  // Fix Observations.tsx inputs/textareas
  if (file === 'Observations.tsx') {
    content = content.replace(/readOnly/g, '');
    // Change checked to defaultChecked
    content = content.replace(/ checked /g, ' defaultChecked ');
    // remove value=, replace with defaultValue= wait we didn't use value
    content = content.replace(/value="([^"]+)"/g, 'defaultValue="$1"');
  }

  // Also in Header.tsx
  if (file === 'Header.tsx') {
    content = content.replace(
      /<span className="text-xs font-medium text-secondary">([^<]+)<\/span>/,
      `<input type="text" defaultValue="$1" className="text-xs font-medium text-secondary bg-transparent w-24 focus:outline-none text-center" />`
    );
  }

  fs.writeFileSync(path.join(componentsDir, file), content, 'utf8');
}

console.log('Script completed');
