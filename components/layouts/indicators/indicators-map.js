import React, { useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-map-gl'
import {ChevronLeft} from 'react-feather'

import colors from '../../../styles/colors'

import {IndicatorsContext} from '.'
import {AppContext} from '../../../pages'

const COLORS = {
  vert: colors.green,
  orange: colors.orange,
  rouge: colors.red
}

const defaultColor = colors.darkerGrey

export const IndicatorsMap = ({hovered, isDROM}) => {
  const {selectedLocation, setSelectedLocation, isMobileDevice} = useContext(AppContext)
  const {indicators, selectedStat} = useContext(IndicatorsContext)
  const {code = '', region = ''} = hovered && hovered.feature ? hovered.feature.properties : {}

  const selectedRegion = selectedLocation.includes('REG') ? selectedLocation.split('-')[1] : null

  const getColors = useCallback(() => {
    const colors = ['match', ['get', 'code']]

    indicators.forEach(indicator => {
      const color = COLORS[indicator[`${selectedStat}Color`]] || defaultColor
      colors.push(indicator.code, color)
    })

    colors.push(defaultColor)

    return colors.length > 3 ? colors : defaultColor
  }, [indicators, selectedStat])

  const getOpacity = useCallback(() => {
    return ['case', ['==', ['get', 'code'], region || code], 0, 0.5]
  }, [code, region])

  if (indicators) {
    const indicateurSynthese = {
      id: 'indicateur',
      'source-layer': 'departements',
      type: 'fill',
      paint: {
        'fill-color': getColors(),
        'fill-outline-color': '#ffffff'
      }
    }

    const regionsLayer = {
      id: 'regions-fill',
      'source-layer': 'regions',
      type: 'fill',
      filter: selectedRegion ? ['!=', ['get', 'code'], selectedRegion] : ['has', 'code'],
      paint: {
        'fill-opacity': getOpacity(),
        'fill-color': '#fff',
        'fill-outline-color': colors.darkBlue
      }
    }

    return (
      <>
        {!isDROM && selectedLocation !== 'FRA' && (
          <div className={`back ${isMobileDevice ? 'mobile' : ''}`} onClick={() => setSelectedLocation('FRA')}>
            <ChevronLeft /> Retour
          </div>
        )}
        <Source
          id='decoupage-administratif'
          type='vector'
          attribution='Centre de crise sanitaire'
          url='https://etalab-tiles.fr/data/decoupage-administratif.json'
        >
          <Layer beforeId='place-town' {...indicateurSynthese} />
          <Layer beforeId='place-town' {...regionsLayer} />
        </Source>

        <style jsx>{`
          .back {
            z-index: 2;
            position: absolute;
            display: flex;
            align-items: center;
            top: 0;
            left: calc(240px + 0.5em); // 240px is the width of <MapSelector />
            margin: 0.5em;
            padding: 0.5em;
            border-radius: 4px;
            color: #fff;
            background-color: #000000aa;
          }

          .back.mobile {
            left: 0;
          }

          .back:hover {
            cursor: pointer;
            background-color: #000;
          }
          `}</style>
      </>
    )
  }

  return null
}

IndicatorsMap.defaultProps = {
  hovered: null,
  isDROM: false
}

IndicatorsMap.propTypes = {
  hovered: PropTypes.object,
  isDROM: PropTypes.bool
}

export const onSelect = ({properties}) => {
  const {code, region} = properties
  return `${region ? 'DEP' : 'REG'}-${code}`
}

export const HoveredInfos = ({feature}) => {
  const {indicators} = useContext(IndicatorsContext)
  const {code} = feature.properties
  const {
    tauxIncidence,
    tauxIncidenceColor,
    tauxReproductionEffectif,
    tauxReproductionEffectifColor,
    tauxOccupationRea,
    tauxOccupationReaColor,
    tauxPositiviteTests,
    tauxPositiviteTestsColor
  } = indicators.find(indicator => indicator.code === code)

  return (
    <div>
      <div className='indicators'>
        <div>Taux d’incidence: <div className={tauxIncidenceColor}><b>{tauxIncidence}</b> ({tauxIncidenceColor})</div></div>
        <div>Taux de reproduction effectif: <div className={tauxReproductionEffectifColor}><b>{tauxReproductionEffectif}</b> ({tauxReproductionEffectifColor})</div></div>
        <div>Taux d’occupation des lits en réa: <div className={tauxOccupationReaColor}><b>{tauxOccupationRea}</b> ({tauxOccupationReaColor})</div></div>
        <div>Taux de positivité des tests RT-PCR: <div className={tauxPositiviteTestsColor}><b>{tauxPositiviteTests.slice(0, 3)}</b> ({tauxPositiviteTestsColor})</div></div>
      </div>

      <style jsx>{`
          .indicators {
            font-size: medium;
            margin: 0.5em 0;
          }

          .indicators > div {
            display: flex;
          }

          .indicators b {
            margin-left: 0.4em;
          }

          .rouge {
            color: ${colors.red};
          }

          .orange {
            color: ${colors.orange};
          }

          .vert {
            color: ${colors.green};
          }
          `}</style>
    </div>
  )
}

HoveredInfos.propTypes = {
  feature: PropTypes.shape({
    properties: PropTypes.object.isRequired
  }).isRequired
}

export const interactiveLayersIds = ['regions-fill', 'indicateur']
