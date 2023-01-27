const path = require("path")
// vue.config.js
// npx vue-cli-service inspect to see options
// changed webpack config to autmatically use data-url's to load ALL images under 1 MB (default is 4KB)

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // options...
  // vue-cli assumes
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  outputDir: path.resolve(__dirname, "../builds/adm_design_proof"),

  chainWebpack: (config) => {
    config.module
      .rule("images") // -> Default configuration
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 1048576,
        fallback: {
          loader: "file-loader",
          options: { name: "img/[name].[hash:8].[ext]" },
        },
      })
      .end()

    const fontsRule = config.module.rule("fonts")
    fontsRule.uses.clear()

    config.module
      .rule("fonts")
      .test(/\.(ttf|otf|eot|woff|woff2)$/)
      .use("base64-inline-loader")
      .loader("base64-inline-loader")
      .tap((options) => {
        // modify the options...
        return options
      })
      .end()

    const svgRule = config.module.rule("svg")

    svgRule.uses.clear()

    svgRule
      .use("vue-loader")
      .loader("vue-loader") // or `vue-loader-v16` if you are using a preview support of Vue 3 in Vue CLI
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader")
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/scss/_variables.scss";
        `,
      },
    },
  },
}
