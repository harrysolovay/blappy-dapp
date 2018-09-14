const { getBabelLoader } = require('react-app-rewired')
const {
  createLoaderMatcher,
  findRule,
  addBeforeRule,
} = require('./utilities')
const {
  rewireBlockstackBuild,
  rewireBlockstackDevServer,
} = require('react-app-rewire-blockstack')

module.exports = {

  webpack: (config, env) => {

    const babelLoader = getBabelLoader(config.module.rules)
    babelLoader.options.babelrc = true

    const eslintLoaderMatcher = createLoaderMatcher('eslint-loader')

    const rule = findRule(
      config.module.rules,
      eslintLoaderMatcher,
    )

    delete rule.options.baseConfig
    rule.options.useEslintrc = true

    const stylelintRules = {
      loader: 'stylelint-custom-processor-loader',
      options: {
        configPath: null,
        emitWarning: true,
      },
    }

    addBeforeRule(
      config.module.rules,
      eslintLoaderMatcher,
      stylelintRules,
    )

    if(env === 'production') {
      config = rewireBlockstackBuild(config)
    }

    return config

  },

  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      let config = configFunction(proxy, allowedHost)
      config = rewireBlockstackDevServer(config)
      return config
    }
  }

}