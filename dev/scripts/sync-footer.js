const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const template = fs.readFileSync(path.join(root, 'Library', 'footer.lbi'), 'utf8')
  .replace(/\r\n/g, '\n').trim();
const files = [
  'index.html',
  ...['learning-docs', 'research'].flatMap(dir =>
    fs.readdirSync(path.join(root, dir))
      .filter(name => name.endsWith('.html'))
      .map(name => path.join(dir, name))
  )
];
const begin = '<!-- #BeginLibraryItem "/Library/footer.lbi" -->';
const end = '<!-- #EndLibraryItem -->';
const updates = [];

for (const file of files) {
  const fullPath = path.join(root, file);
  const original = fs.readFileSync(fullPath, 'utf8');
  const newline = original.includes('\r\n') ? '\r\n' : '\n';
  const footer = begin + newline + template.replace(/\n/g, newline) + newline + end;
  const start = original.indexOf(begin);
  let updated;

  if (start !== -1) {
    const finish = original.indexOf(end, start + begin.length);
    if (finish === -1 || original.indexOf(begin, start + begin.length) !== -1) {
      throw new Error('Invalid footer markers in ' + file);
    }
    updated = original.slice(0, start) + footer + original.slice(finish + end.length);
  } else if (file === 'index.html') {
    const existing = /<footer class="home-footer">[\s\S]*?<\/footer>/g;
    if ((original.match(existing) || []).length !== 1) {
      throw new Error('Expected one homepage footer in ' + file);
    }
    updated = original.replace(existing, () => footer);
  } else {
    const script = /<script defer src="\.\.\/assets\/js\/common\.js"><\/script>/g;
    if (/<footer\b/i.test(original) || (original.match(script) || []).length !== 1) {
      throw new Error('Cannot safely add footer to ' + file);
    }
    updated = original.replace(script, () => footer + newline + '  <script defer src="../assets/js/common.js"></script>');
  }
  if (updated !== original) updates.push({ fullPath, updated });
}

for (const update of updates) fs.writeFileSync(update.fullPath, update.updated);
console.log('Updated footers in ' + updates.length + ' files.');
