import React, {useState, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-map-gl'
import {ChevronLeft} from 'react-feather'

const departements = require('@etalab/decoupage-administratif/data/departements.json')

import colors from '../../../styles/colors'

import {getReport} from '../../../lib/data'

import {IndicatorsContext} from '.'
import {AppContext} from '../../../pages'
import IndicatorsDepartement from './indicators-departement'

const COLORS = {
  vert: colors.green,
  orange: colors.orange,
  rouge: colors.red
}

const defaultColor = colors.darkerGrey

export const IndicatorsMap = ({hovered, isDROM}) => {
  const {selectedLocation, setSelectedLocation, isMobileDevice} = useContext(AppContext)
  const {selectedDate, selectedStat} = useContext(IndicatorsContext)
  const {code = '', region = ''} = hovered && hovered.feature ? hovered.feature.properties : {}

  const [indicators, setIndicators] = useState([])

  const handleBack = event => {
    event.stopPropagation()
    setSelectedLocation('FRA')
  }

  const getSelectedRegion = useCallback(() => {
    const [locationType, code] = selectedLocation.split('-')
    if (locationType !== 'FRA') {
      return locationType === 'REG' ? code : departements.find(d => d.code === code).region
    }

    return null
  }, [selectedLocation])

  const selectedRegion = getSelectedRegion()

  useEffect(() => {
    const getIndicatorsData = async () => {
      const {history} = await getReport(selectedDate, 'DEP')
      setIndicators(history.filter(({date}) => selectedDate === date).map(dep => {
        return {
          ...dep,
          code: dep.code.split('-')[1]
        }
      }))
    }

    getIndicatorsData()
  }, [selectedDate])

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
          <div className={`back ${isMobileDevice ? 'mobile' : ''}`} onClick={handleBack}>
            <ChevronLeft /> Retour
          </div>
        )}
        <Source
          id='decoupage-administratif'
          type='vector'
          attribution='Données Ministère des Solidarités et de la santé'
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

export const HoveredInfos = ({feature, options = {allIndicators: true}}) => {
  const {code, region} = feature.properties
  const {allIndicators} = options

  if (region) {
    return (
      <IndicatorsDepartement code={code} allIndicators={allIndicators} />
    )
  }

  return null
}

HoveredInfos.defaultProps = {
  options: {}
}

HoveredInfos.propTypes = {
  feature: PropTypes.shape({
    properties: PropTypes.object.isRequired
  }).isRequired,
  options: PropTypes.object
}

export const interactiveLayersIds = ['regions-fill', 'indicateur']
