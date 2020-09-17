import prefectures from '../pages-consignes-prefectorales-covid19.json'

const ars = {
  '01': 'https://www.guadeloupe.ars.sante.fr/',
  '02': 'https://www.martinique.ars.sante.fr/',
  '03': 'https://www.guyane.ars.sante.fr/',
  '04': 'https://www.lareunion.ars.sante.fr/',
  '06': 'https://www.mayotte.ars.sante.fr/',
  11: 'https://www.iledefrance.ars.sante.fr/',
  24: 'https://www.centre-val-de-loire.ars.sante.fr/',
  27: 'https://www.bourgogne-franche-comte.ars.sante.fr/',
  28: 'https://www.normandie.ars.sante.fr/',
  32: 'https://www.hauts-de-france.ars.sante.fr/',
  44: 'https://www.grand-est.ars.sante.fr/',
  52: 'https://www.pays-de-la-loire.ars.sante.fr/',
  53: 'https://www.bretagne.ars.sante.fr/',
  75: 'https://www.nouvelle-aquitaine.ars.sante.fr/',
  76: 'https://www.occitanie.ars.sante.fr/',
  84: 'https://www.auvergne-rhone-alpes.ars.sante.fr/',
  93: 'https://www.paca.ars.sante.fr/',
  94: 'https://www.corse.ars.sante.fr/'
}

export const getPrefectureWebsite = code => {
  const prefecture = prefectures.find(({codeDepartement}) => codeDepartement === code)
  return prefecture.pagePrefecture
}

export const getARSWebsite = code => ars[code]
