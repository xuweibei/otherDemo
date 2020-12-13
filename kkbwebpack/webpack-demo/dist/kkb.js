!(function (modules) {
  const installModules = {};
  function __kkbpack_require__(moduleId) {
    if (installModules[moduleId]) {
      return installModules[moduleId];
    }
    let module = (installModules[moduleId] = {
      exports: {},
    });
    modules[moduleId].call(
      modules.exports,
      module,
      exports,
      __kkbpack_require__
    );
    return module.exports;
  }
  return __kkbpack_require__('./src/index.js');
})('./src/index.js':function(module,exports,__kkbpack_require__){
      eval('const say = __kkbpack_require__("./src/a.js");say('haha');')
    },/src/a.js:function(module,exports,__kkbpack_require__){
      eval('export default function (data) {
  console.log(data);
}
')
    });
