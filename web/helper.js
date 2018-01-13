/* eslint-disable */
const fs = require('fs');

let text = '';
fs.readdir('.', (err, files) => {
  files.forEach((file) => {
    const name = file.split('.')[0];
    text += `export const ${name} = require('./${file}');\n`;
  });
  fs.writeFileSync('./index.js', text);
});
