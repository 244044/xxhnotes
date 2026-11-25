//引入gulp和gulp插件
var { watch, series, parallel, src, dest, task } = require('gulp');
var revHash = require('gulp-rev-hash3');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass')(require('sass'));
var connect = require('gulp-connect');
var pump = require('pump');
var url = require('url');
var fs = require('fs');
var mkdirp = require('mkdirp');
var del = require('del');
var rewrite = require('http-rewrite-middleware');
var log = require('fancy-log');
var path = require('path');
const open = require('gulp-open');
var purgecss = require('gulp-purgecss');
var insert = require('gulp-insert');
var babel = require('gulp-babel');
const replace = require('gulp-replace');
const stripComments = require('gulp-strip-comments');

// 环境配置 BEGIN
var env = {};

// 生产环境[true:是;flase:否]
env.production = false;

// 网站的html文件所在路径
// env.htmlRootPath = './sample/';
env.htmlRootPath = '../';


// 多语言目录名
env.langFolder = 'lang';

// 资源目录
env.assetsPathOrg = '';
env.devAssets = '';
// env.assetsPath = 'assets/';
Object.defineProperty(env, 'assetsPath', (() => {
  var _assetsPath = '';
  return {
    set: function (path) {
      _assetsPath = path;
      env.devAssets = '__' + path;
      env.assetsPathOrg = path;
    },
    get: function () {
      if (env.production == false) {
        return _assetsPath ? env.htmlRootPath + env.devAssets : env.htmlRootPath + '__assets/';
      } else {
        return _assetsPath ? env.htmlRootPath + _assetsPath : env.htmlRootPath + 'assets/';
      }
    }
  };
})());
env.assetsPath = 'assets/';

env.rootPath = __dirname;

// 生成网站的assets js文件所在路径
env.jsAssetsPathOrg = '';
env.devJsAssets = '';
// env.jsAssetsPath = 'assets/js/';
Object.defineProperty(env, 'jsAssetsPath', (() => {
  var _jsAssetsPath = '';
  return {
    set: function (path) {
      _jsAssetsPath = path;
      env.devJsAssets = '__' + path;
      env.jsAssetsPathOrg = path;
    },
    get: function () {
      if (env.production == false) {
        return _jsAssetsPath ? env.htmlRootPath + env.devJsAssets : path.join(env.assetsPath, 'js/');
      } else {
        return _jsAssetsPath ? env.htmlRootPath + _jsAssetsPath : path.join(env.assetsPath, 'js/');
      }
    }
  };
})());
env.jsAssetsPath = 'assets/js/';

// 生成网站的assets css文件所在路径
env.cssAssetsPathOrg = '';
env.devCssAssets = '';
// env.cssAssetsPath = 'assets/css/';
Object.defineProperty(env, 'cssAssetsPath', (() => {
  var _cssAssetsPath = '';
  return {
    set: function (path) {
      _cssAssetsPath = path;
      env.devCssAssets = '__' + path;
      env.cssAssetsPathOrg = path;
    },
    get: function () {
      if (env.production == false) {
        return _cssAssetsPath ? env.htmlRootPath + env.devCssAssets : path.join(env.assetsPath, 'css/');
      } else {
        return _cssAssetsPath ? env.htmlRootPath + _cssAssetsPath : path.join(env.assetsPath, 'css/');
      }
    }
  };
})());
env.cssAssetsPath = 'assets/css/';

// 生成网站的assets 图片文件所在路径
// env.imgAssetsPath = 'images/';
Object.defineProperty(env, 'imgAssetsPath', (() => {
  var _imgAssetsPath = '';
  return {
    set: function (path) {
      _imgAssetsPath = path;
    },
    get: function () {
      return _imgAssetsPath ? env.assetsPath + _imgAssetsPath : env.assetsPath + 'images/';
    }
  };
})());

// 生成网站的assets 字体文件所在路径
// env.fontAssetsPath = 'fonts/';
Object.defineProperty(env, 'fontAssetsPath', (() => {
  var _fontAssetsPath = '';
  return {
    set: function (path) {
      _fontAssetsPath = path;
    },
    get: function () {
      return _fontAssetsPath ? env.assetsPath + _fontAssetsPath : env.assetsPath + 'fonts/';
    }
  };
})());

// 开发测试模式资源目录

// 开发环境根路径
env.srcPath = './src/';

// 脚本文件js开发目录
// env.jsSrcPath = 'js/';
Object.defineProperty(env, 'jsSrcPath', (() => {
  var _jsSrcPath = '';
  return {
    set: function (path) {
      _jsSrcPath = path;
    },
    get: function () {
      return _jsSrcPath ? env.srcPath + _jsSrcPath : env.srcPath + 'js/';
    }
  };
})());
// 静态资源js开发目录
Object.defineProperty(env, 'staticJsSrcPath', (() => {
  var _staticJsSrcPath = '';
  return {
    set: function (path) {
      _staticJsSrcPath = path;
    },
    get: function () {
      return _staticJsSrcPath ? env.srcPath + _staticJsSrcPath : env.srcPath + 'static/js/';
    }
  };
})());

// 样式文件scss开发目录
//env.scssSrcPath = 'sass/';
Object.defineProperty(env, 'scssSrcPath', (() => {
  var _scssSrcPath = '';
  return {
    set: function (path) {
      _scssSrcPath = path;
    },
    get: function () {
      return _scssSrcPath ? env.srcPath + _scssSrcPath : env.srcPath + 'sass/';
    }
  };
})());

// 静态资源css开发目录
Object.defineProperty(env, 'staticCssSrcPath', (() => {
  var _staticCssSrcPath = '';
  return {
    set: function (path) {
      _staticCssSrcPath = path;
    },
    get: function () {
      return _staticCssSrcPath ? env.srcPath + _staticCssSrcPath : env.srcPath + 'static/css/';
    }
  };
})());

// 图片资源开发目录
env.imgSrcPath = env.srcPath + 'images/';
/*Object.defineProperty(env, 'imgSrcPath', (() => {
  var _imgSrcPath = '';
  return {
    set:function(path){
      _imgSrcPath = path;
    },
    get:function(){
      return _imgSrcPath ? env.srcPath + _imgSrcPath : env.srcPath + 'images/';
    }
  };
})());*/

// 图片资源格式
env.imgType = '{gif,jpg,png,svg,webp,ico}';

// 字体资源开发目录
env.fontSrcPath = env.srcPath + 'fonts/';
/*Object.defineProperty(env, 'fontSrcPath', (() => {
  var _fontSrcPath = '';
  return {
    set:function(path){
      _fontSrcPath = path;
    },
    get:function(){
      return _fontSrcPath ? env.srcPath + _fontSrcPath : env.srcPath + 'fonts/';
    }
  };
})());*/

// 使用到的字体
env.fonts = ['iconfont'];

// 字体资源格式
env.fontType = '{eot,svg,ttf,woff,woff2,otf}';

// 是否启用多语言
env.enableMultiLanguage = false;
// 配置多语言路径
env.multiLanguage = {};
// 多语言路径采用相对路径，相对于开发目录 (dev),
env.multiLanguage.de = '../de/';
env.multiLanguage.fr = '../fr/';
env.multiLanguage.jp = '../jp/';
env.multiLanguage.es = '../es/';

// 服务器配置
env.connect = {};

// 服务器路径，一般与env.htmlRootPath一致
env.connect.root = env.htmlRootPath;
Object.defineProperty(env.connect, 'root', (() => {
  var _root = '';
  return {
    set: function (path) {
      _root = path;
    },
    get: function () {
      return _root ? _root : env.htmlRootPath;
    }
  };
})());

const app_host = process.env.npm_config_app_host ? process.env.npm_config_app_host : '127.0.0.1';
const app_port = process.env.npm_config_app_port ? process.env.npm_config_app_port : 6023;

// 端口号
env.connect.port = app_port;

// 实时更新网页资源预览
env.connect.livereload = true;

// 服务器地址
env.connect.host = app_host;

env.connect.publish_url = '';
// 环境配置 END

// TODO: 清理
const clean = function (cb) {
  cleanFonts(cb);
  //cleanDevAssets(cb);
  //series(cleanFonts, cleanDevAssets)();
  cb();

};

// 清理字体文件
const cleanFonts = function (cb) {
  if (fs.existsSync(env.fontAssetsPath)) {
    del.sync([env.fontAssetsPath + '**'], { force: true });
    cb();
  }
};

// 清理开发目录
const cleanDevAssets = function (cb) {
  const devAssetsPath = path.join(env.htmlRootPath, env.devAssets);
  log('Starting \'cleanDevAssets\':' + devAssetsPath);
  if (fs.existsSync(devAssetsPath)) {
    del.sync([devAssetsPath], { force: true });
    log('devAssets Deleted: ' + devAssetsPath);
  }
  // js
  if (env.devJsAssets) {
    const devJsAssetsPath = path.join(env.htmlRootPath, env.devJsAssets);
    if (fs.existsSync(devJsAssetsPath)) {
      del.sync([devJsAssetsPath], { force: true });
      log('devJsAssets Deleted: ' + devJsAssetsPath);
    }
  }
  // css
    if (env.devCssAssets) {
      const devCssAssetsPath = path.join(env.htmlRootPath, env.devCssAssets);
    if (fs.existsSync(devCssAssetsPath)) {
      del.sync([devCssAssetsPath], { force: true });
      log('devCssAssets Deleted: ' + devCssAssetsPath);
    }
  }
  log('Finished \'cleanDevAssets\'');
  cb();
};

// 创建资源目录
const createAssetsPath = function (cb) {
  if (createPath(env.assetsPath)) {
    createPath(env.jsAssetsPath);
    createPath(env.cssAssetsPath);
    createPath(env.imgAssetsPath);
    createPath(env.fontAssetsPath);
  }
  cb();
}

// 创建src目录
const createSrcPath = function (cb) {
  createPath(env.srcPath);
  createPath(env.jsSrcPath);
  createPath(env.scssSrcPath);
  createPath(Array.isArray(env.imgSrcPath) ? env.imgSrcPath[0] : env.imgSrcPath);
  createPath(Array.isArray(env.fontSrcPath) ? env.fontSrcPath[0] : env.fontSrcPath);
  cb();
}

// 创建目录
const createPath = function (path) {
  try {
    //if (!fs.existsSync(path)) {
    log('Create path: ' + path);
    return mkdirp(path);
    //}
  } catch (err) {
    console.error(err);
  }
}

// 遍历html文件资源链接，添加hash参数
const revHtml = function (cb) {
  log('[START] html files rev: ' + env.htmlRootPath);
  return src([
    env.htmlRootPath + '*.html',
    env.htmlRootPath + '**/*.html',
    '!node_modules/**',
    '!' + env.htmlRootPath + 'webdev/**'])
    .pipe(revHash({
      assetsDir: env.htmlRootPath,
    }))
    .pipe(dest(env.htmlRootPath)).on('end', function () {
      log('[FINISHED] html files rev: ' + env.htmlRootPath);
      if (cb) cb();
    });
};

// 多环境配置替换
let replacements = null;
const replaceEnvMap = function() {
  if (replacements !== null) {
    return replacements;
  }

  replacements = [];
  // 配置文件
  const configFile = env.production ? './config/env.build.json' : './config/env.dev.json';
  // 配置文件是否存在
  if (!fs.existsSync(configFile)) {
    log('no such config file: ' + configFile);
    return replacements;
  }
  // 配置文件内容
  const configContent = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  
  for (const [key, value] of Object.entries(configContent)) {
    replacements.push({
      from: '__JOWEB_' + key.toUpperCase() + '__',
      to: `${value}`
    });
  }
  return replacements;
};

// 复制js文件
const copyJs = function (cb) {
  log('[START] copy js: ' + env.jsAssetsPath);
  // 多环境配置替换
  const replacements = replaceEnvMap();
  
  // 分别处理 JS 文件和非 JS 文件
  let completedTasks = 0;
  let totalTasks = 2;
  
  const onTaskComplete = function() {
    completedTasks++;
    if (completedTasks === totalTasks) {
      log('[FINISHED] copy js: ' + env.jsAssetsPath);
      if (cb) cb();
    }
  };
  
  // 1. 处理 JS 文件 - 进行注释移除和环境变量替换
  let jsStream = src([env.staticJsSrcPath + '**/*.js']);
  
  // 去除注释
  jsStream = jsStream.pipe(stripComments({
    safe: true,
    ignore: /url\([\w\s:\/=\-\+;,]*\)/g
  }));
  
  // 环境变量替换
  for (const replacement of replacements) {
    jsStream = jsStream.pipe(replace(replacement.from, replacement.to));
  }
  
  jsStream.pipe(dest(env.jsAssetsPath)).on('end', onTaskComplete);
  
  // 2. 处理非 JS 文件 - 只复制
  let nonJsStream = src([
    env.staticJsSrcPath + '**/*',
    '!' + env.staticJsSrcPath + '**/*.js'
  ]);
  
  nonJsStream.pipe(dest(env.jsAssetsPath)).on('end', onTaskComplete);
  
  return jsStream;
}

// 复制 min.js 文件
const copyMinJs = function (cb) {
  log('[START] copy min.js: ' + env.jsAssetsPath);
  // 多环境配置替换
  const replacements = replaceEnvMap();
  let stream = src(env.jsSrcPath + '*.min.js');
  
  // 去除注释（只处理 .min.js 文件，它们都是JavaScript文件）
  stream = stream.pipe(stripComments({
    safe: true,
    ignore: /url\([\w\s:\/=\-\+;,]*\)/g
  }));
  
  // 环境变量替换
  for (const replacement of replacements) {
    stream = stream.pipe(replace(replacement.from, replacement.to));
  }
  return stream
    .pipe(dest(env.jsAssetsPath))
    .on('end', function () {
      log('[FINISHED] min.js files copied: ' + env.jsAssetsPath);
      cb();
    });
}


// 编译js
const jsTranspile = function (cb) {
  log('[START] js compiling: ' + env.jsSrcPath);
  
  // 多环境配置替换
  const replacements = replaceEnvMap();

  // 完成计数器
  let completedTasks = 0;
  let totalTasks = 1; // 至少有编译任务

  // 完成回调函数
  const onTaskComplete = function() {
    completedTasks++;
    if (completedTasks === totalTasks) {
      log('[FINISHED] js compiled: ' + env.jsAssetsPath);
      if (cb) cb();
    }
  };

  // 2. 编译非 min.js 文件
  let stream = src(env.jsSrcPath + '!(*.min).js');

  stream = stream
    .pipe(insert.transform(function (contents, file) {
      // 判断是否有多语言文件
      if (file.basename[0] != '_') {
        var langFile = file.dirname + '/' + env.langFolder + '/_' + file.basename;
        if (fs.existsSync(langFile)) {
          contents = contents + '\n' + '// lang file:' + langFile + '\n' + fs.readFileSync(langFile, 'utf8');
        }
      }
      // 多语言末尾引入文件__last.js
      var langFile = file.dirname + '/' + env.langFolder + '/__lang.js';
      if (fs.existsSync(langFile)) {
        contents = contents + '\n' + '// lang file:' + langFile + '\n' + fs.readFileSync(langFile, 'utf8');
      }
      for (const replacement of replacements) {
        contents = contents.replaceAll(replacement.from, replacement.to);
      }
      return contents;
    }))
    .pipe(browserify({
      insertGlobals: false,
      debug: !env.production,
      paths: [__dirname + '/src/js'],
      transform: ['brfs']
    }))
    .pipe(babel({
      // presets: ['@babel/preset-env']
      presets: [
        [
          '@babel/preset-env',
          {
            "modules": false
          }
        ]
      ],
    }));

  for (const replacement of replacements) {
    stream = stream.pipe(replace(replacement.from, replacement.to));
  }

  return stream.pipe(rename({
    extname: '.js'
  }))
  .pipe(dest(env.jsAssetsPath))
  .on('end', function () {
    onTaskComplete();
  });
};

// 编译并压缩js
const jsMinify = function (cb) {
  log('[START] js minifying: ' + env.jsSrcPath);

  // 多环境配置替换
  const replacements = replaceEnvMap();

  // 完成计数器
  let completedTasks = 0;
  let totalTasks = 1; // 至少有编译任务

  // 完成回调函数
  const onTaskComplete = function() {
    completedTasks++;
    if (completedTasks === totalTasks) {
      log('[FINISHED] js minified: ' + env.jsAssetsPath);
      if (cb) cb();
    }
  };

  // 编译并压缩非 min.js 文件
  let stream = src(env.jsSrcPath + '!(*.min).js');
  
  stream = stream
    .pipe(insert.transform(function (contents, file) {
      // 判断是否有多语言文件
      if (file.basename[0] != '_') {
        var langFile = file.dirname + '/' + env.langFolder + '/_' + file.basename;
        if (fs.existsSync(langFile)) {
          contents = contents + '\n' + fs.readFileSync(langFile, 'utf8');
        }
      }
      // 多语言末尾引入文件__lang.js
      var langFile = file.dirname + '/' + env.langFolder + '/__lang.js';
      if (fs.existsSync(langFile)) {
        contents = contents + '\n' + fs.readFileSync(langFile, 'utf8');
      }
      for (const replacement of replacements) {
        contents = contents.replaceAll(replacement.from, replacement.to);
      }
      return contents;
    }))
    .pipe(browserify({
      insertGlobals: false,
      debug: !env.production,
      paths: [__dirname + '/src/js'],
      transform: ['brfs']
    }))
    .pipe(babel({
      presets: [
        [
          '@babel/preset-env',
          {
            "modules": false
          }
        ]
      ],
    }));

  // 遍历 replacements，依次 pipe replace
  replacements.forEach(rep => {
    stream = stream.pipe(replace(rep.from, rep.to));
  });

  const drop_console = typeof process.env.npm_config_drop_console !== 'undefined' ? process.env.npm_config_drop_console : true;
  return stream.pipe(uglify({
    compress: {
      drop_console: drop_console
    }
  }))
    .pipe(rename({
      extname: '.js'
    }))
    .pipe(dest(env.jsAssetsPath))
    .on('end', function () {
      onTaskComplete();
    })
};

// 复制css文件至目标目录
const copyCss = function (cb) {
  log('[START] copy css: ' + env.cssAssetsPath);
  // 多环境配置替换
  const replacements = replaceEnvMap();
  let stream = src([env.staticCssSrcPath + '**/*']);
  
  // 对CSS文件进行环境变量替换
  for (const replacement of replacements) {
    stream = stream.pipe(replace(replacement.from, replacement.to));
  }
  
  // 对CSS文件去除注释（使用正则表达式）
  stream = stream.pipe(replace(/\/\*[\s\S]*?\*\//g, ''));
  
  return stream
    .pipe(dest(env.cssAssetsPath))
    .on('end', function () {
      log('[FINISHED] copy css: ' + env.cssAssetsPath);
      cb();
    });
};

// 编译scss为目标css
const cssSass = function (cb) {
  log('[START] scss compiling: ' + env.cssAssetsPath);
  // 创建目标目录
  return src([env.scssSrcPath + '*.scss', env.scssSrcPath + '**/*.scss'])
    .pipe(insert.transform(function (contents, file) {
      // 判断是否有多语言文件
      if (file.basename[0] != '_') {
        var langFile = file.dirname + '/' + env.langFolder + '/_' + file.basename;
        if (fs.existsSync(langFile)) {
          contents = contents + '\n' + '// lang file:' + langFile + '\n' + fs.readFileSync(langFile, 'utf8');
        }
      }

      // 多语言末尾引入文件__last.scss
      var langFile = file.dirname + '/' + env.langFolder + '/__last.scss';
      if (fs.existsSync(langFile)) {
        contents = contents + '\n' + '// lang file:' + langFile + '\n' + fs.readFileSync(langFile, 'utf8');
      }

      return contents;
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(env.cssAssetsPath))
    .on('end', function () {
      log('[FINISHED] scss compiled: ' + env.cssAssetsPath);
      if (cb) cb();
    });
};

// 压缩css
const cssMinify = function (cb) {
  log('[START] scss compiling: ' + env.cssAssetsPath);
  return src([env.scssSrcPath + '*.scss', env.scssSrcPath + '**/*.scss'])
    .pipe(insert.transform(function (contents, file) {
      // 判断是否有多语言文件
      if (file.basename[0] != '_') {
        var langFile = file.dirname + '/' + env.langFolder + '/_' + file.basename;
        if (fs.existsSync(langFile)) {
          contents = contents + '\n' + fs.readFileSync(langFile, 'utf8');
        }
      }

      // 多语言末尾引入文件__last.scss
      var langFile = file.dirname + '/' + env.langFolder + '/__last.scss';
      if (fs.existsSync(langFile)) {
        contents = contents + '\n' + fs.readFileSync(langFile, 'utf8');
      }

      return contents;
    }))
    .pipe(sass({
      includePaths: ['node_modules'],
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(dest(env.cssAssetsPath))
    .on('end', function () {
      log('[FINISHED] scss compiled: ' + env.cssAssetsPath);
      cb();
    });
}

// 压缩去除多余css
const removeCss = function (cb) {
  return src([env.scssSrcPath + '*.scss', env.scssSrcPath + '**/*.scss'])
    .pipe(sass({
      includePaths: ['node_modules'],
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(purgecss({
      content: [env.htmlRootPath + '*.html', 'src/js/**/*.js'],
    }))
    .pipe(dest(env.cssAssetsPath))
    .on('end', function () {
      log('[FINISHED] removeCss: ' + env.cssAssetsPath);
      cb();
    });
}

// 图片资源目录
const getImagesSrcPath = function () {
  var imagesSrc = new Array();
  // 判断是否为数组
  if (Array.isArray(env.imgSrcPath)) {
    for (var i = 0; i < env.imgSrcPath.length; i++) {
      imagesSrc.push(env.imgSrcPath[i] + '*.' + env.imgType, env.imgSrcPath[i] + '**/*.' + env.imgType);
    }
  } else {
    imagesSrc.push(env.imgSrcPath + '*.' + env.imgType, env.imgSrcPath + '**/*.' + env.imgType);
  }
  return imagesSrc;
}

// 图片资源
const buildImagesDev = function (cb) {
  log('[START] images build: ' + env.imgAssetsPath);
  return src(getImagesSrcPath()).pipe(dest(env.imgAssetsPath)).on('end', function () {
    log('[FINISHED] images build: ' + env.imgAssetsPath);
    typeof cb === 'function' && cb();
  });
}

// 字体资源目录
const getFontsSrcPath = function () {
  var fontsSrc = new Array();
  if (env.fonts.length > 0) {
    var fonts = env.fonts.length > 1 ? '{' + env.fonts.join(',') + '}' : env.fonts[0];
    // 判断是否为数组
    if (Array.isArray(env.fontSrcPath)) {
      for (var i = 0; i < env.fontSrcPath.length; i++) {
        fontsSrc.push(
          env.fontSrcPath[i] + '*' + fonts + '/*.' + env.fontType
        );
      }
    } else {
      fontsSrc.push(
        env.fontSrcPath + '*' + fonts + '/*.' + env.fontType
      );
    }
  } else if (env.fonts === 'all') {
    // 判断是否为数组
    if (Array.isArray(env.fontSrcPath)) {
      for (var i = 0; i < env.fontSrcPath.length; i++) {
        fontsSrc.push(
          env.fontSrcPath[i] + '*.' + env.fontType,
          env.fontSrcPath[i] + '**/*.' + env.fontType
        );
      }
    } else {
      fontsSrc.push(
        env.fontSrcPath + '*.' + env.fontType,
        env.fontSrcPath + '**/*.' + env.fontType
      );
    }
  }
  return fontsSrc;
}

// 字体资源
const buildFontsDev = function (cb) {
  var fontPath = getFontsSrcPath();
  log('[START] fonts build: ' + env.fontAssetsPath);
  if (fontPath.length > 0) {
    return src(fontPath).pipe(dest(env.fontAssetsPath)).on('end', function () {
      log('[FINISHED] fonts build: ' + env.fontAssetsPath);
      cb();
    });
  } else {
    log('[FINISHED] No fonts found in: ' + env.fontSrcPath);
    cb();
  }
}

// 热更新
task("reload-server", function (cb) {
  log('[START] Reloading server...');
  return src(env.srcPath)
    .pipe(connect.reload())
    .on('end', function () {
      log('[FINISHED] Reloading server');
      cb();
    });
});

// 构建资源（生成用于生产环境的css、js文件）
const defaultDev = function (cb) {
  // 监听资源文件修改，生成文件
  watch([env.staticCssSrcPath + '**/*'], series(copyCss, 'reload-server'));
  watch([env.scssSrcPath + '**/*.scss'], series(cssSass, 'reload-server'));

  // 监听资源文件修改，生成文件
  watch([env.staticJsSrcPath + '**/*'], series(copyJs, 'reload-server'));
  watch([env.jsSrcPath + '**/*.min.js'], series(copyMinJs, 'reload-server'));
  watch([env.jsSrcPath + '**/*.js'], series(jsTranspile, 'reload-server'));
  
  // 监听图片资源
  watch(getImagesSrcPath(), series(buildImagesDev));

  // 监听字体资源
  var fontPath = getFontsSrcPath();
  if (fontPath.length > 0) {
    watch(getFontsSrcPath(), series(buildFontsDev));
  }

  cb();
};

// 开发环境配置
const dev = function (cb) {
  env.production = false;
  cleanDevAssets(cb);
  cb();
}

// 创建多语言 assets 资源目录
const createMultiLanguageAssetsPath = function (cb) {
  if (!env.enableMultiLanguage) {
    cb();
    return false;
  }
  let targetAssetsPath = '';
  for (let prop in env.multiLanguage) {
    targetAssetsPath = path.join(path.resolve('./'), env.multiLanguage[prop]);
    if (fs.existsSync(targetAssetsPath)) {         // joyoshare/de
      targetAssetsPath = path.join(targetAssetsPath, '/assets/');
      if (fs.existsSync(targetAssetsPath)) {        // joyoshare/de/assets/
        log('clean multi language ' + prop + ' assets: ' + targetAssetsPath);
        del.sync([targetAssetsPath], { force: true });
      }

      log('Create multi language ' + prop + ' assets: ' + targetAssetsPath + ' ....');

      // 生成 js
      src(env.jsSrcPath + '*.js')
        .pipe(browserify({
          insertGlobals: false,
          debug: !env.production,
          paths: [__dirname + '/src/js'],
          transform: ['brfs']
        }))
        .pipe(uglify())
        .pipe(rename({
          extname: '.js'
        }))
        .pipe(dest(path.join(targetAssetsPath, '/js/')));  // joyoshare/de/assets/js/

      // 生成 css
      src([env.scssSrcPath + '*.scss', env.scssSrcPath + '**/*.scss'])
        .pipe(sass({
          includePaths: ['node_modules'],
          outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(dest(path.join(targetAssetsPath, '/css/')));  //joyoshare/de/assets/css/

      // 生成 图片
      src(getImagesSrcPath()).pipe(dest(path.join(targetAssetsPath, '/images/')));  //joyoshare/de/assets/images/

      // 生成 font
      let fontPath = getFontsSrcPath();
      if (fontPath.length > 0) {
        src(fontPath).pipe(dest(path.join(targetAssetsPath, '/fonts/')));  //joyoshare/de/assets/fonts/
      }

    } else {
      log('no such multi language directory: ' + targetAssetsPath);
    }
  }
  cb();
}

// 构建资源（生成用于生产环境的css、js文件）
const defaultBuild = function (cb) {
  // 监听资源文件修改，生成文件
  watch([env.scssSrcPath + '**/*.scss'], series(cssSass, 'reload-server'));
  watch([env.cssSrcPath + '**/*.css'], series(copyCss, 'reload-server'));

  // 监听资源文件修改，生成文件
  watch([env.jsSrcPath + '**/*.js'], series(jsTranspile, 'reload-server'));

  // 监听图片资源
  watch(getImagesSrcPath(), series(buildImagesDev));

  // 监听字体资源
  var fontPath = getFontsSrcPath();
  if (fontPath.length > 0) {
    watch(getFontsSrcPath(), series(buildFontsDev));
  }

  cb();
};

// 构建资源（生成用于生产环境的css、js文件）
const productionEnv = function (cb) {
  env.production = true;
  cb();
};

// watch构建资源（生成用于生产环境的css、js文件）
const jWatch = function (cb) {
  env.production = true;
  cb();
};

// 发布资源（生成用于生产环境的css、js文件，html资源链接添加文件hash参数）
const publish = function (cb) {
  env.production = true;
  cb();
}

// 启动服务器
const webserver = function (cb) {
  connect.server({
    name: 'Dev App',
    root: env.connect.root,
    livereload: env.connect.livereload,
    port: env.connect.port,
    host: env.connect.host,
    middleware: function (connect, opt) {
      return [
        rewrite.getMiddleware([
          { from: '^/' + env.jsAssetsPathOrg + '(.*)$', to: '/' + env.devJsAssets + '$1' },
          { from: '^/' + env.cssAssetsPathOrg + '(.*)$', to: '/' + env.devCssAssets + '$1' },
          { from: '^/' + env.assetsPathOrg + 'images/(.*)$', to: '/' + env.devAssets + 'images/$1' },
          { from: '^/' + env.assetsPathOrg + 'fonts/(.*)$', to: '/' + env.devAssets + 'fonts/$1' }
        ]),
        function (req, res, next) {
          if (!env.connect.publish_url) {
            next();
            return;
          }
          if (!req._parsedUrl.pathname.match(/html$/) && !req._parsedUrl.pathname.match(/\/$/)) {
            next();
            return;
          }

          fs.readFile(req._parsedUrl.pathname.match(/\/$/) ? env.htmlRootPath + req._parsedUrl.pathname + '/index.html' : env.htmlRootPath + req._parsedUrl.pathname, (err, data) => {
            if (err) {
              console.warn(err);
              res.end(err)
              return;
            }
            var replacedHtml = data.toString().replace(new RegExp("(?<=(href=\"|src=\"|srcset=\"|data-bg=\"|data-src=\"))" + env.connect.publish_url, "g"), 'http://' + env.connect.host + ':' + env.connect.port)
            res.end(replacedHtml)
          });
        }
      ];
    }
  });

  // node进程结束
  process.on('exit', () => {
    log('process exit')
    devdone(cb);
  });

  cb();
}

// 打开浏览器
const openbrowser = function (cb) {
  // var uri = 'http://' + env.connect.host + ':' + env.connect.port;
  var uri = 'http://' + env.connect.host + ':' + env.connect.port;
  src(env.connect.root).pipe(open({ uri: uri, app: 'chrome' }));
  cb();
};

// 结束开发
const devdone = function (cb) {
  cleanDevAssets(cb);
}

// 配置环境变量，只支持二级配置
exports.env = function (newEnv) {
  for (const [key, value] of Object.entries(newEnv)) {
    // 判断配置项是否存在
    if (env.hasOwnProperty(key)) {
      switch (typeof value) {
        case 'number':
          env[key] = value;
          break;
        case 'string':
          env[key] = value;
          break;
        case 'boolean':
          env[key] = value;
          break;
        // 数组或对象
        case 'object':
          if (Array.isArray(value)) {
            env[key] = value;
          } else {
            for (const [key2, value2] of Object.entries(newEnv[key])) {
              if (env[key].hasOwnProperty(key2)) {
                env[key][key2] = value2
              }
            }
          }
          break;
      }

    }
  }
  return env;
};

// 发布生产环境文件
exports.publish = series(
  publish,
  clean,
  createSrcPath,
  createAssetsPath,
  parallel(copyCss, copyJs, copyMinJs, jsMinify, cssMinify, buildImagesDev, buildFontsDev),
  parallel(revHtml)
);

// 生成生产环境文件
exports.build = series(
  productionEnv,
  clean,
  createSrcPath,
  createAssetsPath,
  parallel(copyCss, copyJs, copyMinJs, jsMinify, cssMinify, buildImagesDev, buildFontsDev),
  createMultiLanguageAssetsPath
);

// 监听并生成生产环境文件
exports.watch = series(
  jWatch,
  clean,
  createSrcPath,
  createAssetsPath,
  parallel(copyCss, cssSass, copyJs, copyMinJs, jsMinify, cssMinify, buildImagesDev, buildFontsDev),
  createMultiLanguageAssetsPath,
  defaultBuild
);

// 开发环境
exports.default = series(
  dev,
  clean,
  createSrcPath,
  createAssetsPath,
  parallel(copyCss, cssSass, copyJs, copyMinJs, jsTranspile, buildImagesDev, buildFontsDev),
  defaultDev,
  webserver,
  openbrowser
);

// 监听并生成生产环境文件
exports.devWatch = series(
  jWatch,
  clean,
  createSrcPath,
  createAssetsPath,
  parallel(copyCss, cssSass, copyJs, copyMinJs, jsTranspile, buildImagesDev, buildFontsDev),
  createMultiLanguageAssetsPath,
  defaultBuild
);

// 调用配置
