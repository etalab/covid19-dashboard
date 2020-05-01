import {groupBy} from 'lodash'
import fetch from 'isomorphic-unfetch'

import geo from '../geo.json'
import dates from '../dates.json'

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

export function findMostRecentDateForData(report, key) {
  if (!report) {
    return
  }

  function findInHistory(date) {
    const datedReport = report.history.find(r => r.date === date)

    if (!datedReport) {
      return
    }

    if (key in datedReport) {
      return date
    }

    return findInHistory(getPreviousDate(date))
  }

  return findInHistory(report.date)
}

const dataCache = new Map()

async function getData(fileName) {
  if (!dataCache.has(fileName)) {
    const response = await fetch(`/data/${fileName}`)
    dataCache.set(fileName, await response.json())
  }

  return dataCache.get(fileName)
}

function getFileName(date, code) {
  if (code === 'REG' || code === 'DEP') {
    return `date-${date}.json`
  }

  return `code-${code}.json`
}

export async function getReport(date, code) {
  const records = await getData(getFileName(date, code))
  const filteredReports = records.filter(item => item.code.includes(code))
  return {
    ...filteredReports.find(r => r.date === date),
    history: filteredReports
  }
}

export async function getPreviousReport(report) {
  if (!report) {
    return
  }

  const previousDate = getPreviousDate(report.date)
  return getReport(previousDate, report.code)
}

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
