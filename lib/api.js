import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import
import {groupBy, sortBy, defaults, pick} from 'lodash'

const SOURCE_PRIORITIES = {
  'sante-publique-france': 1,
  'agences-regionales-sante': 2,
  prefectures: 3,
  'lperez-historical-data': 4
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

export const getData = async () => {
  const records = await fetchJson('https://raw.githubusercontent.com/opencovid19-fr/data/master/dist/chiffres-cles.json')

  return consolidate(records)
}
