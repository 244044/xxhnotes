var app = {};
app.detectOs = require('./detect-os');
// header
require('./header');

app.toArr = function (list) {
  if (list.length) {
    return Array.prototype.slice.call(list)
  }
  return null;
}
