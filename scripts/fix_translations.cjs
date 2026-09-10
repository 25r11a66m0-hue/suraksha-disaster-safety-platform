const fs = require('fs');
const filePath = 'src/i18n/translations.ts';
let code = fs.readFileSync(filePath, 'utf8');

// I will just re-read the file and clean it up.
// Actually, it's easier to use a regex to strip all the newly added keys if they are malformed, but wait...
console.log(code.length);
