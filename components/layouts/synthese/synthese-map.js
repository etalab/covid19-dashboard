import React, {useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-map-gl'

import colors from '../../../styles/colors'
import {SyntheseContext} from '.'
import {AppContext} from '../../../pages'

const COLORS = {
  vert: colors.green,
  orange: colors.orange,
  rouge: colors.red
}

const defaultColor = 'rgba(0,0,0,0)'

export const SyntheseMap = ({hovered}) => {
  const {selectedLocation} = useContext(AppContext)
  const {synthese} = useContext(SyntheseContext)
  const {code = ''} = hovered && hovered.feature ? hovered.feature.properties : {}

  const getColors = useCallback(() => {
    const colors = ['match', ['get', 'code']]

    synthese.forEach(({code, indicateurSynthese}) => {
      colors.push(code, COLORS[indicateurSynthese])
    })

    colors.push(defaultColor)

    return colors.length > 3 ? colors : defaultColor
  }, [synthese])

  const getOpacity = useCallback(() => {
    const opacity = ['match', ['get', 'code'], code, 1]
    const locationCode = selectedLocation && selectedLocation.includes('DEP') ? selectedLocation.split('-')[1] : null

    if (locationCode && locationCode !== code) {
      opacity.push(locationCode, 1)
    }

    opacity.push(0.5)
    return opacity
  }, [code, selectedLocation])

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
    return (
      <Source
        id='decoupage-administratif'
        type='vector'
        attribution='Données Ministère des Solidarités et de la Santé'
        url='https://etalab-tiles.fr/data/decoupage-administratif.json'
      >
        <Layer {...indicateurSynthese} />
      </Source>
    )
  }

  return null
}

SyntheseMap.defaultProps = {
  hovered: null
}

SyntheseMap.propTypes = {
  hovered: PropTypes.object
}

export const HoveredInfos = ({feature}) => {
  const {synthese} = useContext(SyntheseContext)

  if (synthese && synthese.length > 0) {
    const {code} = feature.properties
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

export const interactiveLayersIds = ['indicateur']
