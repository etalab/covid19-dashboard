import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import
import {groupBy, sortBy, defaults, pick} from 'lodash'

const SOURCE_PRIORITIES = {
  'ministere-sante': 1,
  'sante-publique-france': 2,
  'agences-regionales-sante': 3,
  prefectures: 4,
  'lperez-historical-data': 5
}

export async function fetchJson(url) {
  const response = await fetch(url)
  if (response && response.ok) {
    return response.json()
  }
}

function consolidate(records) {
  const territoriesGroups = groupBy(records, r => `${r.date}-${r.code}`)

  return Object.keys(territoriesGroups).map(id => {
    return pick(sortBy(territoriesGroups[id], r => SOURCE_PRIORITIES[r.sourceType])
      .reduce((acc, row) => {
        defaults(acc, row)
        return acc
      }, {}), ['casConfirmes', 'deces', 'reanimation', 'hospitalises', 'date', 'code', 'nom'])
  })
}

const GOUV_START_DATE = '2020-03-02'

function filterRecords(records, isGouv) {
  if (!isGouv) {
    return records
  }

  return records
    .filter(r => ['ministere-sante', 'sante-publique-france'].includes(r.sourceType))
    .filter(r => r.date >= GOUV_START_DATE)
}

export const getData = async (isGouv) => {
  const records = await fetchJson('https://raw.githubusercontent.com/opencovid19-fr/data/master/dist/chiffres-cles.json')

  return consolidate(filterRecords(records, isGouv))
}
