export const formatDate = isoString => {
  const [y, m, d] = isoString.split('-')
  return `${d}/${m}/${y}`
}
