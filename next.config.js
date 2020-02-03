/* eslint-disable */
const withLess = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')
// const withPlugins = require('next-compose-plugins');
const withCss = require('@zeit/next-css')
const fs = require('fs')
const path = require('path')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
)

module.exports = {
  ...withCss(
    withLess({
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: themeVariables // make your antd custom effective
      },
      webpack: (config, { isServer }) => {
        if (isServer) {
          const antStyles = /antd\/.*?\/style.*?/
          const origExternals = [...config.externals]
          config.externals = [
            (context, request, callback) => {
              if (request.match(antStyles)) return callback()
              if (typeof origExternals[0] === 'function') {
                origExternals[0](context, request, callback)
              } else {
                callback()
              }
            },
            ...(typeof origExternals[0] === 'function' ? [] : origExternals)
          ]

          config.module.rules.unshift({
            test: antStyles,
            use: 'null-loader'
          })
        }
        config.resolve.alias = {
          ...config.resolve.alias,
          '@js': path.join(__dirname, 'assets/js'),
          '@hooks': path.join(__dirname, 'assets/hooks'),
          '@components': path.join(__dirname, 'components'),
          '@aplo': path.join(__dirname, 'apollo')
        }
        config.plugins.push(new AntdDayjsWebpackPlugin())
        return config
      }
    })
  )
}
