const {defineConfig} = require('@vue/cli-service')
const {VantResolver} = require('@vant/auto-import-resolver');
const ComponentsPlugin = require('unplugin-vue-components/webpack');
module.exports = {
  devServer: {
    port: 80,
  },
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },
}