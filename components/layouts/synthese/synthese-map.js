import React, {useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-map-gl'
import {ChevronLeft} from 'react-feather'

import colors from '../../../styles/colors'

import {SyntheseContext} from '.'
import {AppContext} from '../../../pages'

const COLORS = {
  vert: colors.green,
  orange: colors.orange,
  rouge: colors.red
}

const defaultColor = 'rgba(0,0,0,0)'

export const SyntheseMap = ({hovered, isDROM}) => {
  const {selectedLocation, setSelectedLocation} = useContext(AppContext)
  const {synthese} = useContext(SyntheseContext)
  const {code = '', region = ''} = hovered && hovered.feature ? hovered.feature.properties : {}

  const selectedRegion = selectedLocation.includes('REG') ? selectedLocation.split('-')[1] : null

  const getColors = useCallback(() => {
    const colors = ['match', ['get', 'code']]

    synthese.forEach(({code, indicateurSynthese}) => {
      colors.push(code, COLORS[indicateurSynthese])
    })

    colors.push(defaultColor)

    return colors.length > 3 ? colors : defaultColor
  }, [synthese])

  const getOpacity = useCallback(() => {
    if (!region) {
      return ['match', ['get', 'region'], code, 1, 0.5]
    }

    const opacity = ['match', ['get', 'code'], code, 1]
    const locationCode = selectedLocation && selectedLocation.includes('DEP') ? selectedLocation.split('-')[1] : null

    if (locationCode && locationCode !== code) {
      opacity.push(locationCode, 1)
    }

    opacity.push(0.5)
    return opacity
  }, [code, region, selectedLocation])

  if (synthese) {
    const indicateurSynthese = {
      id: 'indicateur',
      'source-layer': 'departements',
      type: 'fill',
      paint: {
        'fill-color': getColors(),
        'fill-opacity': getOpacity(),
        'fill-outline-color': '#ffffff'
      }
    }

    const regionsLayer = {
      id: 'regions-fill',
      'source-layer': 'regions',
      type: 'fill',
      filter: selectedRegion ? ['!=', ['get', 'code'], selectedRegion] : ['has', 'code'],
      paint: {
        'fill-opacity': 1,
        'fill-color': 'rgba(0, 0, 0, 0)',
        'fill-outline-color': colors.darkBlue
      }
    }

    return (
      <>
        {!isDROM && selectedLocation !== 'FRA' && (
          <div className='back' onClick={() => setSelectedLocation('FRA')}>
            <ChevronLeft /> Retour
          </div>
        )}
        <Source
          id='decoupage-administratif'
          type='vector'
          attribution='Données Ministère des Solidarités et de la Santé'
          url='https://etalab-tiles.fr/data/decoupage-administratif.json'
        >
          <Layer {...indicateurSynthese} />
          <Layer {...regionsLayer} />
        </Source>

        <style jsx>{`
          .back {
            z-index: 2;
            position: absolute;
            display: flex;
            align-items: center;
            top: 0;
            margin: 0.5em;
            padding: 0.5em;
            border-radius: 4px;
            color: #fff;
            background-color: #000000aa;
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

SyntheseMap.defaultProps = {
  hovered: null,
  isDROM: false
}

SyntheseMap.propTypes = {
  hovered: PropTypes.object,
  isDROM: PropTypes.bool
}

export const onSelect = ({properties}) => {
  const {code, region} = properties
  return `${region ? 'DEP' : 'REG'}-${code}`
}

export const HoveredInfos = ({feature}) => {
  const {synthese} = useContext(SyntheseContext)
  const {code, region} = feature.properties

  if (region && synthese && synthese.length > 0) {
    const {indicateurSynthese} = synthese.find(s => s.code === code)

    return (
      <div>
        Département classé <b style={{color: COLORS[indicateurSynthese]}}>{indicateurSynthese}</b>
      </div>
    )
  }

  return null
}

HoveredInfos.propTypes = {
  feature: PropTypes.shape({
    properties: PropTypes.object.isRequired
  }).isRequired
}

export const interactiveLayersIds = ['regions-fill', 'indicateur']
