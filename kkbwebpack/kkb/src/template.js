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
  return __kkbpack_require__('__entry__');
})(__modules_content__);
