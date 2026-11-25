var system = {
  win: ['Win321','Windows1'],
  mac: ['Mac68K','MacPPC','Macintosh','MacIntel'],
  unix: ['X11'],
  linux: ['Linux']
}

function detectOs(){
  var isWin=(navigator.platform=="Win32")||(navigator.platform=="Windows");
  var isMac=(navigator.platform=="Mac68K")||(navigator.platform=="MacPPC")||(navigator.platform=="Macintosh")||(navigator.platform=="MacIntel") || (navigator.platform=="iPhone") || (/iPhone/i.test(navigator.userAgent));
  if (isMac) {
    return"mac";
  }
  return "win";
}

module.exports = detectOs
