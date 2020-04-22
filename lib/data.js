import {groupBy, uniq, every} from 'lodash'

import records from '../chiffres-cles.json'
import geo from '../geo.json'

export function reportToGeoJSON(report, date) {
  const byCode = groupBy(report.history, 'code')
  return {
    type: 'FeatureCollection',
    features: Object.keys(byCode).filter(code => Boolean(geo[code].center)).map(code => {
      const selectedDateAvailable = byCode[code].find(r => r.date === date)
      const properties = selectedDateAvailable ? selectedDateAvailable : {code}

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: geo[code].center
        },
        properties: {
          ...properties,
          ...byCode[code].find(r => r.date === date),
          history: byCode[code].filter(r => date >= r.date)
        }
      }
    }).filter(i => Boolean(i))
  }
}

export function getMostRecentDateForData(date, code, key) {
  const report = getReport(date, code)

  if (key in report) {
    return date
  }

  return getMostRecentDateForData(getPreviousDate(date), code, key)
}

export function getReport(date, code) {
  const filteredReports = records.filter(item => item.code.includes(code))
  return {
    ...filteredReports.find(r => r.date === date),
    history: filteredReports
  }
}

export function getPreviousReport(report) {
  if (!report) {
    return
  }

  const previousDate = getPreviousDate(report.date)
  return getReport(previousDate, report.code)
}

export const dates = uniq(records.filter(r => r.code === 'FRA').map(r => r.date)).sort()

export function getPreviousDate(date) {
  const dateIdx = dates.indexOf(date)
  if (dateIdx > 0) {
    return dates[dateIdx - 1]
  }
}

export function getNextDate(date) {
  const dateIdx = dates.indexOf(date)
  if (dateIdx < (dates.length - 1)) {
    return dates[dateIdx + 1]
  }
}
