module.exports = function buildConfig(env) {
  return require('./client/webpack/' + env + '.js')({ env: env })
}
