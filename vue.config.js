const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,

  configureWebpack: {
    resolve: {
      alias: {
        'balm-ui-plus': 'balm-ui/dist/balm-ui-plus.js',
        'balm-ui-css': 'balm-ui/dist/balm-ui.css'
      }
    }
  },

  chainWebpack: (config) => {
    config.module
      .rule('js')
      .exclude.add(/node_modules/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .end();
  },

  // Si tu préfères utiliser chainWebpack :
  // chainWebpack: (config) => {
  //   config.resolve.alias
  //     .set('balm-ui-plus', 'balm-ui/dist/balm-ui-plus.js')
  //     .set('balm-ui-css', 'balm-ui/dist/balm-ui.css');
  // }
});