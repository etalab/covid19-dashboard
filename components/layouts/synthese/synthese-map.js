import React, {useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-map-gl'

import colors from '../../../styles/colors'
import {SyntheseContext} from '.'

const COLORS = {
  vert: colors.green,
  orange: colors.orange,
  rouge: colors.red
}

const defaultColor = 'rgba(0,0,0,0)'

export const SyntheseMap = ({hovered}) => {
  const {synthese} = useContext(SyntheseContext)
  const {code = ''} = hovered && hovered.feature ? hovered.feature.properties : {}

  const expression = useMemo(() => {
    const expression = ['match', ['get', 'code']]

    synthese.forEach(({code, indicateurSynthese}) => {
      expression.push(code, COLORS[indicateurSynthese])
    })

    expression.push(defaultColor)

    return expression
  }, [synthese])

  const indicateurSyntheseLayer = useMemo(() => {
    if (synthese) {
      return {
        id: 'indicateur',
        'source-layer': 'departements',
        type: 'fill',
        paint: {
          'fill-color': expression.length > 3 ? expression : defaultColor,
          'fill-opacity': ['match', ['get', 'code'], code, 1, 0.5],
          'fill-outline-color': '#ffffff'
        }
      }
    }

    return null
  }, [synthese, code, expression])

  if (synthese) {
    return (
      <Source
        id='decoupage-administratif'
        type='vector'
        attribution='Données Ministère des Solidarités et de la Santé'
        url='https://etalab-tiles.fr/data/decoupage-administratif.json'
      >
        <Layer {...indicateurSyntheseLayer} />
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

export const interactiveLayersIds = ['indicateur']
