module.exports = buildOptions => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    ...buildOptions,
    minify: isProduction,
    drop: isProduction ? ['console', 'debugger'] : [],
  }
}
