const {keyBy, chain} = require('lodash')

const departements = require('@etalab/decoupage-administratif/data/departements.json')
const regions = require('@etalab/decoupage-administratif/data/regions.json')

const {fetchCsv} = require('./util')

const departementsIndex = keyBy(departements, 'code')
const regionsIndex = keyBy(regions, 'code')

function parseIndicator(value) {
  if (value !== 'NA') {
    return Number.parseFloat(value)
  }
}

const hasIndicatorValue = (departements, indicateur) => {
  const indicateurs = departements.map(departement => departement[indicateur])
  const indicateursWithValue = indicateurs.filter(i => !isNaN(i))

  return indicateursWithValue.length > 0 ? true : null
}

const TODAY = (new Date()).toISOString().slice(0, 10)

async function loadIndicateurs() {
  const csvOptions = {
    filter: row => row.extract_date === TODAY || row.extract_date < TODAY
  }

  const departementsRows = await fetchCsv(
    'https://www.data.gouv.fr/fr/datasets/r/4acad602-d8b1-4516-bc71-7d5574d5f33e',
    csvOptions
  )

  const departementsReports = chain(departementsRows)
    .map(row => {
      return {
        date: row.extract_date,
        code: `DEP-${row.departement}`,
        tauxIncidence: parseIndicator(row.tx_incid),
        tauxIncidenceColor: row.tx_incid_couleur,
        tauxReproductionEffectif: parseIndicator(row.R),
        tauxReproductionEffectifColor: row.R_couleur,
        tauxOccupationRea: parseIndicator(row.taux_occupation_sae),
        tauxOccupationReaColor: row.taux_occupation_sae_couleur,
        tauxPositiviteTests: parseIndicator(row.tx_pos),
        tauxPositiviteTestsColor: row.tx_pos_couleur,
        sourceType: 'ministere-sante'
      }
    }).value()

  /*
    Les données concernant les indicateurs à la maille régionale ne sont pas disponibles.
    Le rapport doit cependant contenir une valeur différent de `null` pour chaque taux
    si au moins un des départements de la région dispose d’une valeur pour ces taux.
    Ceci afin que les données ne soient pas filtrées par la méthode `findMostRecentDateForData` et permettre l’affichage des données départemental.
  */
  const regionsReports = chain(departementsReports)
    .filter(r => r.code.slice(4) in departementsIndex)
    .groupBy(r => `${r.date}-${departementsIndex[r.code.slice(4)].region}`)
    .map(regionRows => {
      const firstRow = regionRows[0]
      const region = regionsIndex[departementsIndex[firstRow.code.slice(4)].region]
      return {
        date: firstRow.date,
        code: `REG-${region.code}`,
        nom: region.nom,
        tauxIncidence: hasIndicatorValue(regionRows, 'tauxIncidence'),
        tauxReproductionEffectif: hasIndicatorValue(regionRows, 'tauxReproductionEffectif'),
        tauxOccupationRea: hasIndicatorValue(regionRows, 'tauxOccupationRea'),
        tauxPositiviteTests: hasIndicatorValue(regionRows, 'tauxPositiviteTests'),
        sourceType: 'sante-publique-france'
      }
    }).value()

  const franceRows = await fetchCsv(
    'https://www.data.gouv.fr/fr/datasets/r/d86f11b0-0a62-41c1-bf6e-dc9a408cf7b5',
    csvOptions
  )

  const franceReports = chain(franceRows)
    .map(row => {
      return {
        date: row.extract_date,
        code: 'FRA',
        tauxIncidence: parseIndicator(row.tx_incid),
        tauxReproductionEffectif: parseIndicator(row.R),
        tauxOccupationRea: parseIndicator(row.taux_occupation_sae),
        tauxPositiviteTests: parseIndicator(row.tx_pos),
        sourceType: 'ministere-sante'
      }
    }).value()

  return [...franceReports, ...regionsReports, ...departementsReports]
}

module.exports = {loadIndicateurs}
