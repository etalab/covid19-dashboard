import {deburr, toLower} from 'lodash'

import geo from '../geo.json'

const formatTerritoryName = name => {
  return toLower(deburr(name)).replace(/ /g, '-').replace(/[', ’]/g, '')
}

export const getPrefectureWebsite = code => {
  const {nom} = geo[code]
  const formatedName = formatTerritoryName(nom)
  return `http://www.${formatedName}.gouv.fr`
}

export const getARSWebsite = code => {
  let formatedName
  if (code === 'REG-93') {
    formatedName = 'paca'
  } else if (code === 'REG-11') {
    formatedName = 'iledefrance'
  } else if (code === 'REG-04') {
    formatedName = 'lareunion'
  } else {
    const {nom} = geo[code]
    formatedName = formatTerritoryName(nom)
  }

  return `http://www.${formatedName}.ars.sante.fr`
}
