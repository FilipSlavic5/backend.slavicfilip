const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true, // Ovisno o vašim potrebama

  chainWebpack: (config) => {
    config
      .plugin('define')
      .tap((args) => {
        args[0]['__VUE_PROD_DEVTOOLS__'] = false; // Postavite na false za produkciju
        args[0]['__VUE_OPTIONS_API__'] = true;
        args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = false; // Postavite na false za produkciju
        return args;
      });
  },

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {'^/api': ''}
      },
    }
    }
  });
  
