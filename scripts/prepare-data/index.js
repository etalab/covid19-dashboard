#!/usr/bin/env node
/* eslint camelcase: off */
require('dotenv').config()

const {join} = require('path')
const {outputJson} = require('fs-extra')
const {max, groupBy, sortBy, defaults, pick, uniq, omit, isUndefined} = require('lodash')
const Papa = require('papaparse')

const {replaceResourceFile} = require('./datagouv')
const {buildHospiSpf} = require('./donnees-hospitalieres-spf')
const {buildGouvFr} = require('./gouv-fr')
const {buildVaccination} = require('./vaccination')
const {buildTests} = require('./tests')
const {loadIndicateurs} = require('./indicateurs')

const rootPath = join(__dirname, '..', '..')

const SOURCE_PRIORITIES = {
  'ministere-sante': 1,
  'sante-publique-france': 2,
  etalab: 3
}

function consolidate(records) {
  const territoriesGroups = groupBy(records, r => `${r.date}-${r.code}`)

  return Object.keys(territoriesGroups).map(id => {
    return pick(sortBy(territoriesGroups[id], r => SOURCE_PRIORITIES[r.sourceType])
      .reduce((acc, row) => {
        defaults(acc, row)
        return acc
      }, {}), ['casConfirmes', 'deces', 'decesEhpad', 'casConfirmesEhpad', 'casPossiblesEhpad', 'reanimation', 'hospitalises', 'gueris', 'date', 'code', 'nom', 'testsRealises', 'testsPositifs', 'testsRealisesDetails', 'testsPositifsDetails', 'nouvellesHospitalisations', 'nouvellesReanimations', 'tauxIncidence', 'tauxIncidenceColor', 'tauxReproductionEffectif', 'tauxReproductionEffectifColor', 'tauxOccupationRea', 'tauxOccupationReaColor', 'tauxPositiviteTests', 'tauxPositiviteTestsColor', 'nouvellesPremieresInjections', 'cumulPremieresInjections', 'stockNombreTotalDoses', 'stockNombreDosesPfizer', 'stockNombreDosesModerna', 'livraisonsCumulNombreTotalDoses', 'livraisonsCumulNombreDosesPfizer', 'livraisonsCumulNombreDosesModerna', 'totalPrisesRendezVousSemaine', 'prisesRendezVousSemaineRang1', 'prisesRendezVousSemaineRang2', 'stockEhpadNombreDosesPfizer'])
  })
}

function filterRecords(records) {
  const {START_DATE, END_DATE} = process.env
  const filters = []

  if (START_DATE) {
    filters.push(r => r.date >= START_DATE)
  }

  if (END_DATE) {
    filters.push(r => r.date <= END_DATE)
  }

  return records.filter(r => filters.every(filter => filter(r)))
}

async function loadContribData() {
  return require('../../data/contrib-data.json')
}

async function main() {
  const hospiSpf = await buildHospiSpf()
  const hospiCc = require('../../data/hospi-cc.json')

  const currentDate = max(
    hospiSpf.filter(r => !isUndefined(r.deces)).map(r => r.date)
  )

  const contribData = await loadContribData()
  const tests = await buildTests()
  const indicateurs = await loadIndicateurs()
  const vaccination = await buildVaccination(currentDate)

  const data = consolidate(filterRecords([...contribData, ...hospiSpf, ...hospiCc, ...tests, ...indicateurs, ...vaccination]))

  const dates = uniq(data.filter(r => r.code === 'FRA' && !isUndefined(r.deces)).map(r => r.date)).sort()
  const codes = uniq(data.map(r => r.code))

  const latest = dates[dates.length - 1]

  const dataDirectory = join(rootPath, 'public', 'data')

  await Promise.all(dates.map(async date => {
    await outputJson(join(dataDirectory, `date-${date}.json`), data.filter(r => r.date === date))
  }))

  await outputJson(join(dataDirectory, 'date-latest.json'), data.filter(r => r.date === latest))

  await Promise.all(codes.map(async code => {
    await outputJson(join(dataDirectory, `code-${code}.json`), data.filter(r => r.code === code))
  }))

  await buildGouvFr(data)

  /* Données nationales - onglet Synthèse */

  const frDataJson = Buffer.from(
    JSON.stringify(data.filter(r => r.code === 'FRA' && !isUndefined(r.deces)).map(r => omit(r, 'testsRealisesDetails', 'testsPositifsDetails', 'code', 'nom', 'tauxIncidence', 'tauxReproductionEffectif', 'tauxOccupationRea', 'tauxPositiviteTests')), null, 2)
  )

  if (process.env.DATAGOUV_PUBLISH === '1' || process.env.CONTEXT === 'production') {
    await replaceResourceFile('5f69ecb155c43420918410b8', 'd2671c6c-c0eb-4e12-b69a-8e8f87fc224c', 'synthese-fra.json', frDataJson)
  }

  const frDataCsv = Buffer.from(
    Papa.unparse(data.filter(r => r.code === 'FRA' && !isUndefined(r.deces)).map(r => ({
      date: r.date,
      total_cas_confirmes: 'casConfirmes' in r ? r.casConfirmes : '',
      total_deces_hopital: 'deces' in r ? r.deces : '',
      total_deces_ehpad: 'decesEhpad' in r ? r.decesEhpad : '',
      total_cas_confirmes_ehpad: 'casConfirmesEhpad' in r ? r.casConfirmesEhpad : '',
      total_cas_possibles_ehpad: 'casPossiblesEhpad' in r ? r.casPossiblesEhpad : '',
      patients_reanimation: 'reanimation' in r ? r.reanimation : '',
      patients_hospitalises: 'hospitalises' in r ? r.hospitalises : '',
      total_patients_gueris: 'gueris' in r ? r.gueris : '',
      nouveaux_patients_hospitalises: 'nouvellesHospitalisations' in r ? r.nouvellesHospitalisations : '',
      nouveaux_patients_reanimation: 'nouvellesReanimations' in r ? r.nouvellesReanimations : ''
    })))
  )

  if (process.env.DATAGOUV_PUBLISH === '1' || process.env.CONTEXT === 'production') {
    await replaceResourceFile('5f69ecb155c43420918410b8', 'd3a98a30-893f-47f7-96c5-2f4bcaaa0d71', 'synthese-fra.csv', frDataCsv)
  }

  await outputJson(join(rootPath, 'dates.json'), dates)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
