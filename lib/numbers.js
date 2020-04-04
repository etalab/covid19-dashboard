function formatInteger(number, forcePositiveSign = false) {
  const sign = Math.sign(number)
  const signPrefix = sign > 0 ? (forcePositiveSign ? '+ ' : '') : '- '
  const absValue = Math.abs(number)

  function padThousands(n) {
    if (n < 1000) {
      return n.toString()
    }

    const rest = n % 1000
    const multiple = (n - rest) / 1000

    return padThousands(multiple) + ' ' + rest.toString().padStart(3, '0')
  }

  return signPrefix + padThousands(absValue)
}

module.exports = {formatInteger}
