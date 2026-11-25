(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        throw new Error("Cannot find module '" + o + "'");
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})({
  1: [function (require, module, exports) {
    // var Header = require('lib/header');
    // var header = new Header({
    //     el: '.header',
    //     delay: 750
    // })

    // 功能
    var navs = document.querySelector("#nav-menu-hover");
    var menus = document.querySelector("#menu-open");
    navs.addEventListener("mouseenter", function () {
      // menus.style.display = "block";
      menus.classList.toggle("show");
    });
    navs.addEventListener("mouseleave", function () {
      // menus.style.display = "none";
      menus.classList.remove("show");
    });
  }, {}]
}, {}, [1]);