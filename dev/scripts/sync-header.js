const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const template = fs.readFileSync(path.join(root, 'Library', 'header.lbi'), 'utf8')
  .replace(/\r\n/g, '\n').trim();
const files = [
  'index.html',
  ...['learning-docs', 'research'].flatMap(dir =>
    fs.readdirSync(path.join(root, dir))
      .filter(name => name.endsWith('.html'))
      .map(name => path.join(dir, name))
  )
];
const begin = '<!-- #BeginLibraryItem "/Library/header.lbi" -->';
const end = '<!-- #EndLibraryItem -->';
const updates = [];

for (const file of files) {
  const fullPath = path.join(root, file);
  const original = fs.readFileSync(fullPath, 'utf8');
  const newline = original.includes('\r\n') ? '\r\n' : '\n';
  const header = begin + newline + template.replace(/\n/g, newline) + newline + end;
  const start = original.indexOf(begin);
  const finish = start === -1 ? -1 : original.indexOf(end, start + begin.length);
  let updated = original;

  if (start !== -1 || finish !== -1) {
    if (start === -1 || finish < start || original.indexOf(begin, start + begin.length) !== -1) {
      throw new Error('Invalid header markers in ' + file);
    }
    updated = original.slice(0, start) + header + original.slice(finish + end.length);
  } else {
    if (original.includes('xh-header') || !/<body\b[^>]*>/i.test(original) ||
        !/<\/head>/i.test(original) || !/<\/body>/i.test(original)) {
      throw new Error('Cannot safely add header to ' + file);
    }
    const assets = path.relative(path.dirname(fullPath), path.join(root, 'assets')).replace(/\\/g, '/');
    updated = updated.replace(/<head\b[^>]*>/i, match =>
      match + newline + '  <link rel="stylesheet" href="' + assets + '/css/common.css">');
    updated = updated.replace(/<body\b[^>]*>/i, match => match + newline + header);
    updated = updated.replace(/<\/body>/i,
      '  <script defer src="' + assets + '/js/common.js"></script>' + newline + '</body>');
  }
  if (updated !== original) updates.push({ fullPath, updated });
}

for (const update of updates) fs.writeFileSync(update.fullPath, update.updated);
console.log('Updated headers in ' + updates.length + ' files.');
