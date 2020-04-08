import {groupBy, uniq} from 'lodash'

import records from '../chiffres-cles.json'
import centers from '../centers.json'

export function reportToGeoJSON(report, date) {
  const byCode = groupBy(report.history, 'code')
  return {
    type: 'FeatureCollection',
    features: Object.keys(byCode).filter(code => Boolean(centers[code])).map(code => {
      const selectedDateAvailable = byCode[code].find(r => r.date === date)
      const properties = selectedDateAvailable ? selectedDateAvailable : {code}

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: centers[code]
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

export function getReport(date, code) {
  const filteredReports = records.filter(item => item.code.includes(code))
  return {
    ...filteredReports.find(r => r.date === date),
    history: filteredReports
  }
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
  if (dateIdx < (dates.length - 2)) {
    return dates[dateIdx + 1]
  }
}
