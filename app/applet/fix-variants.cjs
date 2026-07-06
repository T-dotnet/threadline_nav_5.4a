const fs = require('fs');
let content = fs.readFileSync('src/components/AddChildFlow.tsx', 'utf8');
content = content.replace(/variant="ghost"/g, 'variant="muted"');
content = content.replace(/variant="outline"/g, 'variant="white"');
fs.writeFileSync('src/components/AddChildFlow.tsx', content, 'utf8');
