const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const filesToUpdate = [
  'SchoolData.tsx',
  'StudentData.tsx',
  'ResultsTable.tsx',
  'AcademicPath.tsx',
  'TransferData.tsx',
  'Observations.tsx'
];

for (const file of filesToUpdate) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add use client and state
  content = content.replace(
    /export function ([A-Za-z]+)\(\) {(\s+)return \(/s,
    `"use client";\n\nimport { useState } from "react";\n\nexport function $1() {\n  const [isExpanded, setIsExpanded] = useState(false);\n$2return (`
  );

  // 2. Change mb-6 logic
  content = content.replace(
    /className="flex justify-between items-start mb-6"/,
    `className={\`flex justify-between items-start \${isExpanded ? 'mb-6' : ''}\`}`
  );

  // 3. Change button
  content = content.replace(
    /<button className="text-secondary hover:text-primary transition-all">\s*<span className="material-symbols-outlined" data-icon="expand_more">expand_more<\/span>\s*<\/button>/s,
    `<button \n            className="text-secondary hover:text-primary transition-all p-1 -mr-1 rounded-full hover:bg-surface-variant/50"\n            onClick={() => setIsExpanded(!isExpanded)}\n          >\n            <span className="material-symbols-outlined" data-icon={isExpanded ? "expand_less" : "expand_more"}>\n              {isExpanded ? "expand_less" : "expand_more"}\n            </span>\n          </button>`
  );

  // 4a. Find the first div after the button closing.
  // We look for:        </div>\n        <div className="grid ..."> or <div className="overflow... ">
  // Example for SchoolData: </div>\n        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  content = content.replace(
    /(\s*<\/div>\s*)(<div className="(grid|overflow|space-y)[^"]*">)/s,
    `$1{isExpanded && (\n          $2`
  );

  // 5. Close the wrapper before the final </div>\n    </section>
  content = content.replace(
    /(\s*<\/div>\s*)<\/div>\s*<\/section>/s,
    `$1  )}\n      </div>\n    </section>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done!');
