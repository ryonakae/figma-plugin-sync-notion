module.exports = buildOptions => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    ...buildOptions,
    drop: isProduction ? ['console', 'debugger'] : [],
  }
}
