import React, {useContext} from 'react'
import {isEmpty} from 'lodash'

import departements from '@etalab/decoupage-administratif/data/departements.json'
import regions from '@etalab/decoupage-administratif/data/regions.json'

import {AppContext} from '../../../pages'

import {getPrefectureWebsite, getARSWebsite} from '../../../lib/territories'

import colors from '../../../styles/colors'
import theme from '../../../styles/theme'
import PieChartValues from '../../pie-chart-values'
import {SyntheseContext} from '.'

const SyntheseDepartement = () => {
  const {selectedLocation} = useContext(AppContext)
  const {synthese} = useContext(SyntheseContext)

  const getCodeRegion = codeDepartement => {
    const region = departements.find(({code}) => code === codeDepartement)
    return 'REG-' + region.region
  }

  const indicateurDepartement = synthese.find((({code}) => code === selectedLocation.split('-')[1]))

  if (indicateurDepartement && indicateurDepartement.indicateurSynthese) {
    const {nom, code, indicateurSynthese} = indicateurDepartement

    return (
      <div className='indicateurs'>
        <div className='header'>
          <h3>{nom} - {code}</h3>
        </div>
        <div>Ce département est classé <span className='indicateur-synthese'>{indicateurSynthese}</span></div>

        <h4>Informations complémentaires</h4>
        <p>
          <a href={getPrefectureWebsite(selectedLocation)}>Consulter le site de la préfécture</a>
        </p>
        <p>
          <a href={getARSWebsite(getCodeRegion(code))}>Site de l’ARS (Agende Régionale de Santé)</a>
        </p>
        <style jsx>{`
          .indicateurs {
            padding-bottom: 0.2em;
            background-color: ${colors.lighterGrey};
            text-align: center;
          }

          .header {
            padding: 0.2rem;
            margin-bottom: 0.5em;
            background: ${theme.default.alt}
          }

          .header+div {
            margin-top: 1em;
          }

          .indicateur-synthese {
            font-weight: bold;
            color: ${indicateurSynthese === 'orange' ? colors.orange : (indicateurSynthese === 'vert' ? colors.green : colors.red)}
          }
      `}</style>
      </div>
    )
  }

  return (
    <>
      <h3 className='no-data'>Données indisponibles</h3>
      <style jsx>{`
        .no-data {
          text-align: center;
        }
      `}</style>
    </>
  )
}

const DepartementList = departement => {
  if (!isEmpty(departement) && 'indicateurSynthese' in departement) {
    const {nom, code, indicateurSynthese} = departement
    return (
      <>
        <div className='departements-list-container'>
          <div>
            <div>{nom} ({code})</div>
            <div className='indicateur-synthese'>{indicateurSynthese}</div>
          </div>
          <a href={getPrefectureWebsite(`DEP-${code}`)}>Consulter le site de la préfécture</a>
        </div>
        <style jsx>{`
          .departements-list-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            align-items: center;
            border: 1px solid ${theme.default.alt};
            padding: 0.5em;
            margin-bottom: 0.5em;
          }

          .indicateur-synthese {
            font-weight: bold;
            color: ${indicateurSynthese === 'orange' ? colors.orange : (indicateurSynthese === 'vert' ? colors.green : colors.red)}
          }
        `}</style>
      </>
    )
  }

  return null
}

const SyntheseRegion = () => {
  const {selectedLocation} = useContext(AppContext)
  const {synthese} = useContext(SyntheseContext)

  const region = regions.find(({code}) => code === selectedLocation.split('-')[1])

  const getDepartements = codeRegion => {
    return departements.filter(({region}) => region === codeRegion)
  }

  const departementsGroup = getDepartements(selectedLocation.split('-')[1])

  const departementsSynthese = departementsGroup.map(r => {
    return synthese.filter(({code}) => code === r.code)
  })

  return (
    <div className='departements-container'>
      <h3>Région {region.nom}</h3>
      {departementsSynthese.map(departement => {
        const [dep] = departement
        return <DepartementList key={departement.code} {...dep} />
      })}
      <div className='infos-link'>
        <a href={getARSWebsite(`REG-${region.code}`)}>Site de l’ARS (Agende Régionale de Santé)</a>
      </div>
      <style jsx>{`
        .departements-container {
          text-align: center;
          margin-bottom: 0.2em;
        }

        .infos-link {
          margin-top: 1em;
        }
      `}</style>
    </div>
  )
}

const SyntheseStatistics = () => {
  const {isMobileDevice, selectedLocation} = useContext(AppContext)
  const {synthese} = useContext(SyntheseContext)

  const isDepartement = selectedLocation.split('-')[0] === 'DEP'

  const title = 'Répartition des départements selon leur couleur'

  const indicateurVert = synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'vert')).length
  const indicateurOrange = synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'orange')).length
  const indicateurRouge = synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'rouge')).length

  const data = [
    {
      label: 'vert',
      value: indicateurVert,
      color: colors.green
    },
    {
      label: 'orange',
      value: indicateurOrange,
      color: colors.orange
    },
    {
      label: 'rouge',
      value: indicateurRouge,
      color: colors.red
    }
  ].filter(i => i.value > 0)

  const pieColors = data.map(i => i.color)

  return (
    <div className='statistics-container'>
      {selectedLocation === 'FRA' ? (
        <PieChartValues
          title={title}
          data={data}
          colors={pieColors}
          height={isMobileDevice ? 200 : 130} />
      ) : (
        <>
          <div className='title'>{title}</div>
          {isDepartement ? (
            <SyntheseDepartement />
          ) : (
            <SyntheseRegion />
          )}
        </>
      )}

      <style jsx>{`
        .statistics-container {
          margin-bottom: 0.5em;
        }

        .title {
          text-align: center;
          font-size: large;
          font-weight: bold;
          padding: 0.5em;
          margin-top: 0.5em;
        }
      `}</style>
    </div>
  )
}

export default SyntheseStatistics
