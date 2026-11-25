const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const files = [
  'Library/header.lbi', 'index.html',
  ...['learning-docs', 'research'].flatMap(dir =>
    fs.readdirSync(path.join(root, dir))
      .filter(name => name.endsWith('.html'))
      .map(name => dir + '/' + name)
  )
];
const entries = [
  ['ams-notes.html', 'AMS 学习笔记'],
  ['api-laravel-notes.html', 'API 与 Laravel 编写笔记'],
  ['cbs-typescript-notes.html', 'CBS 项目（TypeScript）'],
  ['css-notes.html', 'CSS 学习笔记'],
  ['electron-notes.html', 'Electron 学习笔记'],
  ['github-commit-workflow.html', 'GitHub 提交代码流程'],
  ['javascript-notes.html', 'JavaScript 学习笔记'],
  ['wordpress-site-notes.html', 'WordPress 站点笔记']
];

const updates = [];
for (const file of files) {
  const fullPath = path.join(root, file);
  const original = fs.readFileSync(fullPath, 'utf8');
  if (!original.includes('class="xh-header-menu"')) continue;
  const anchor = /^([ \t]*)<li><a href="\/learning-docs\/ga4-utm-events\.html">GA4 UTM 与点击事件<\/a><\/li>/gm;
  const matches = [...original.matchAll(anchor)];
  if (matches.length !== 1) throw new Error('Expected one learning menu in ' + file);
  const newline = original.includes('\r\n') ? '\r\n' : '\n';
  let updated = original
    .replaceAll('/learning-docs/AI知识点总结理解.html', '/learning-docs/summary-ai.html')
    .replaceAll('/learning-docs/Xshell命令.html', '/learning-docs/xshell命令.html');
  const existing = entries.filter(([name]) => updated.includes('/learning-docs/' + name));
  if (existing.length && existing.length !== entries.length) {
    throw new Error('Incomplete existing learning menu in ' + file);
  }
  if (!existing.length) {
    updated = updated.replace(anchor, (line, indent) => line + entries.map(([name, title]) =>
      newline + indent + '<li><a href="/learning-docs/' + name + '">' + title + '</a></li>'
    ).join(''));
  }
  updates.push({ fullPath, updated });
}
for (const update of updates) fs.writeFileSync(update.fullPath, update.updated);
console.log('Updated navigation in ' + updates.length + ' files.');
