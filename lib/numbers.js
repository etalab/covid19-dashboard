function getSignPrefix(number, forcePositiveSign = false) {
  if (number === 0) {
    return ''
  }

  const sign = Math.sign(number)
  return sign > 0 ? (forcePositiveSign ? '+ ' : '') : '- '
}

function formatInteger(number, forcePositiveSign = false) {
  const signPrefix = getSignPrefix(number, forcePositiveSign)
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
