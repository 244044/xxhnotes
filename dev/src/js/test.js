// var Header = require('lib/header');
// var header = new Header({
//     el: '.header',
//     delay: 750
// })

// 功能
const navs = document.querySelector("#nav-menu-hover");
const menus = document.querySelector("#menu-open");

navs.addEventListener("mouseenter", function() {
    // menus.style.display = "block";
    menus.classList.toggle("show")

});

navs.addEventListener("mouseleave", function() {
    // menus.style.display = "none";
    menus.classList.remove("show")

});