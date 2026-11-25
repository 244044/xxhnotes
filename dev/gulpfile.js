var gulpfile = require("./gulpfile.dev");

// 环境配置
var env = {};
env.htmlRootPath = '../';
// env.imgSrcPath = ['./src/images/', './node_modules/joweb/src/images/'];
// env.fontSrcPath = ['./src/fonts/', './node_modules/joweb/src/fonts/'];
env.fonts = ['Arial-Regular'];
env.connect = {};
// env.connect.host = '127.0.0.1';
env.connect.host = '192.168.1.182';

env.connect.port = 7044;
// 开发服务器 线上绝对链接匹配正则
env.connect.publish_url = 'https://xhxz.xyz';
// 生成网站的assets文件所在路径
// 有版本时，可以设置为 env.assetsPath ='assets/v1/'
env.assetsPath = 'assets/';
env.cssAssetsPath ='assets/css/';
env.jsAssetsPath ='assets/js/';
gulpfile.env(env);

// 发布生产环境文件
exports.publish = gulpfile.publish;

// 生成生产环境文件
exports.build = gulpfile.build;

// watch 生成生产环境文件
exports.watch = gulpfile.watch;

// watch 生成开发环境文件
exports.devWatch = gulpfile.devWatch;

// 开发环境
exports.default = gulpfile.default;