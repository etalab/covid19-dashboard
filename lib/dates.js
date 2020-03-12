export function previousDates(date, comparedDate) {
  const d1 = new Date(date)
  const d2 = new Date(comparedDate)

  return d1 >= d2
}
