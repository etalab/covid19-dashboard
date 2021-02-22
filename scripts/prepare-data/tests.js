const {chain, sumBy, keyBy} = require('lodash')
const {fetchCsv} = require('./util')

const departements = require('@etalab/decoupage-administratif/data/departements.json')
const regions = require('@etalab/decoupage-administratif/data/regions.json')

const departementsIndex = keyBy(departements, 'code')
const regionsIndex = keyBy(regions, 'code')

async function loadSidepTest() {
  const SIDEP_DEP_DATA = 'https://www.data.gouv.fr/fr/datasets/r/406c6a23-e283-4300-9484-54e78c8ae675'
  const SIDEP_REG_DATA = 'https://www.data.gouv.fr/fr/datasets/r/001aca18-df6a-45c8-89e6-f82d689e6c01'
  const SIDEP_FRA_DATA = 'https://www.data.gouv.fr/fr/datasets/r/dd0de5d9-b5a5-4503-930a-7b08dc0adc7c'

  const departementsReports = chain(await fetchCsv(SIDEP_DEP_DATA))
    .filter(r => r.dep in departementsIndex)
    .groupBy(r => `${r.jour}-${r.dep}`)
    .map(rows => {
      const report = {
        date: rows[0].jour,
        code: `DEP-${rows[0].dep}`,
        nom: departementsIndex[rows[0].dep].nom,
        testsRealises: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.T, 10)),
        testsRealisesDetails: [],
        testsPositifs: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.P, 10)),
        testsPositifsDetails: [],
        sourceType: 'sante-publique-france'
      }

      rows.forEach(r => {
        report.testsRealisesDetails.push({age: r.cl_age90, value: Number.parseInt(r.T, 10)})
        report.testsPositifsDetails.push({age: r.cl_age90, value: Number.parseInt(r.P, 10)})
      })

      return report
    })
    .filter(r => r.testsRealises > 0 || r.testsPositifs > 0)
    .value()

  const regionsReports = chain(await fetchCsv(SIDEP_REG_DATA))
    .filter(r => r.reg.padStart(2, '0') in regionsIndex)
    .groupBy(r => `${r.jour}-${r.reg}`)
    .map(rows => {
      const regCode = rows[0].reg.padStart(2, '0')
      const report = {
        date: rows[0].jour,
        code: `REG-${regCode}`,
        nom: regionsIndex[regCode].nom,
        testsRealises: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.T, 10)),
        testsRealisesDetails: [],
        testsPositifs: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.P, 10)),
        testsPositifsDetails: [],
        sourceType: 'sante-publique-france'
      }

      rows.forEach(r => {
        report.testsRealisesDetails.push({age: r.cl_age90, value: Number.parseInt(r.T, 10)})
        report.testsPositifsDetails.push({age: r.cl_age90, value: Number.parseInt(r.P, 10)})
      })

      return report
    })
    .filter(r => r.testsRealises > 0 || r.testsPositifs > 0)
    .value()

  const franceReports = chain(await fetchCsv(SIDEP_FRA_DATA))
    .groupBy(r => r.jour)
    .map(rows => {
      const report = {
        date: rows[0].jour,
        code: 'FRA',
        nom: 'France',
        testsRealises: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.T, 10)),
        testsRealisesDetails: [],
        testsPositifs: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.P, 10)),
        testsPositifsDetails: [],
        sourceType: 'sante-publique-france'
      }

      rows.forEach(r => {
        report.testsRealisesDetails.push({age: r.cl_age90, value: Number.parseInt(r.T, 10)})
        report.testsPositifsDetails.push({age: r.cl_age90, value: Number.parseInt(r.P, 10)})
      })

      return report
    })
    .filter(r => r.testsRealises > 0 || r.testsPositifs > 0)
    .value()

  return [...departementsReports, ...regionsReports, ...franceReports]
}

async function loadTroisLabosTests() {
  const TROISLABOS_TESTS_DATA = 'https://www.data.gouv.fr/fr/datasets/r/b4ea7b4b-b7d1-4885-a099-71852291ff20'

  const csvOptions = {
    filter: row => row.jour < '2020-05-13'
  }

  const departementsReports = chain(await fetchCsv(TROISLABOS_TESTS_DATA, csvOptions))
    .groupBy(r => `${r.jour}-${r.dep}`)
    .map(rows => {
      const report = {
        date: rows[0].jour,
        code: `DEP-${rows[0].dep}`,
        nom: departementsIndex[rows[0].dep].nom,
        testsRealises: sumBy(rows.filter(r => r.clage_covid === '0'), r => Number.parseInt(r.nb_test, 10)),
        testsRealisesDetails: [],
        testsPositifs: sumBy(rows.filter(r => r.clage_covid === '0'), r => Number.parseInt(r.nb_pos, 10)),
        testsPositifsDetails: [],
        sourceType: 'sante-publique-france'
      }

      rows.forEach(r => {
        report.testsRealisesDetails.push({age: r.clage_covid, value: Number.parseInt(r.nb_test, 10)})
        report.testsPositifsDetails.push({age: r.clage_covid, value: Number.parseInt(r.nb_pos, 10)})
      })

      return report
    })
    .filter(r => r.testsRealises > 0 || r.testsPositifs > 0)
    .value()

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
        testsRealises: sumBy(regionRows, 'testsRealises'),
        testsRealisesDetails: firstRow.testsRealisesDetails.map(({age}) => {
          return {
            age,
            value: sumBy(regionRows, r => r.testsRealisesDetails.find(entry => entry.age === age).value)
          }
        }),
        testsPositifs: sumBy(regionRows, 'testsPositifs'),
        testsPositifsDetails: firstRow.testsPositifsDetails.map(({age}) => {
          return {
            age,
            value: sumBy(regionRows, r => r.testsPositifsDetails.find(entry => entry.age === age).value)
          }
        }),
        sourceType: 'sante-publique-france'
      }
    })

  const franceReports = chain(departementsReports)
    .groupBy('date')
    .map(rows => {
      const firstRow = rows[0]
      return {
        date: firstRow.date,
        code: 'FRA',
        nom: 'France',
        testsRealises: sumBy(rows, 'testsRealises'),
        testsRealisesDetails: firstRow.testsRealisesDetails.map(({age}) => {
          return {
            age,
            value: sumBy(rows, r => r.testsRealisesDetails.find(entry => entry.age === age).value)
          }
        }),
        testsPositifs: sumBy(rows, 'testsPositifs'),
        testsPositifsDetails: firstRow.testsPositifsDetails.map(({age}) => {
          return {
            age,
            value: sumBy(rows, r => r.testsPositifsDetails.find(entry => entry.age === age).value)
          }
        }),
        sourceType: 'sante-publique-france'
      }
    })

  return [...departementsReports, ...regionsReports, ...franceReports]
}

async function buildTests() {
  const troisLabosTests = await loadTroisLabosTests()
  const sidepTests = await loadSidepTest()

  return [...troisLabosTests, ...sidepTests]
}

module.exports = {buildTests}
