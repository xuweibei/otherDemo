#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
const defaultConfig = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
};

const config = {
  ...defaultConfig,
  ...require(path.resolve('./kkb.config.js')),
};

class KkbPack {
  constructor(config) {
    this.config = config;
    this.entry = config.entry;
    this.root = process.cwd();
    this.modules = {};
  }
  parse(code, parent) {
    const deps = [];
    let r = /require\('(.*)'\)/g; //简单判断了require里的内容寻找依赖关系
    code = code.replace(r, function (match, arg) {
      const retPath = path.join(parent, arg.replace(/'|"/g), ''); //判断拿到依赖的完整路径
      deps.push(retPath); //将依赖的完整路径进行储存
      return `__kkbpack_require__("./${retPath}")`;
    });
    return {
      code,
      deps,
    };
  }
  createModule(modulePath, name) {
    //拿到某个文件里的所有内容，第一次的时候就是拿到 ./src/index.js里的所有内容
    const fileContent = fs.readFileSync(modulePath, 'utf-8');
    //将这些内容拿到parse里面去查找是否还有其他依赖关系
    const { code, deps } = this.parse(fileContent, path.dirname(name));
    this.modules[name] = `function(module,exports,__kkbpack_require__){
      eval(\'${code}\')
    }`; //储存所有的内容
    deps.forEach((dep) => {
      //依赖的数组来进行判断，是否还有嵌套依赖，进行递归
      this.createModule(path.join(this.root, dep), './' + dep);
    });
  }
  generateModuleStr() {
    let fnTemp = '';
    Object.keys(this.modules).forEach((name) => {
      fnTemp += `${name}:${this.modules[name]}`;
    });
    return fnTemp;
  }
  generateFile() {
    let template = fs.readFileSync(
      path.resolve(__dirname, './template.js'),
      'utf-8'
    );
    this.template = template
      .replace('__entry__', this.entry)
      .replace('__modules_content__', this.generateModuleStr());
    fs.writeFileSync('./dist/' + this.config.output.filename, this.template);
  }
  start() {
    console.log('开始啦', this.root);
    const entryPath = path.resolve(this.root, this.entry);
    this.createModule(entryPath, this.entry); //循环生成文件内容
    console.log(this.modules, '所有代码');
    this.generateFile();
  }
}

const kkb = new KkbPack(config);

kkb.start();
