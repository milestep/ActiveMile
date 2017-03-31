function buildConfig(env) {
  return require('./config/webpack/' + env + '.js')({ env: env })
}

module.exports = buildConfig;
