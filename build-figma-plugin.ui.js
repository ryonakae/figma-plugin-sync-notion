const dotenv = require('dotenv')
const env = JSON.stringify(dotenv.config().parsed)

module.exports = buildOptions => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    ...buildOptions,
    define: {
      'process.env': env,
    },
    minify: isProduction,
    drop: isProduction ? ['console', 'debugger'] : [],
  }
}
