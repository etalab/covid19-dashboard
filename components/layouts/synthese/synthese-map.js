import React, {useContext, useMemo} from 'react'
import {Source, Layer} from 'react-map-gl'

import colors from '../../../styles/colors'
import {SyntheseContext} from '.'

const COLORS = {
  vert: colors.green,
  orange: colors.orange,
  rouge: colors.red
}

export const SyntheseMap = () => {
  const {synthese} = useContext(SyntheseContext)

  const expression = useMemo(() => {
    const expression = ['match', ['get', 'code']]

    synthese.forEach(({code, indicateurSynthese}) => {
      expression.push(code, COLORS[indicateurSynthese])
    })

    expression.push('rgba(0,0,0,0)')

    return expression
  }, [synthese])

  const indicateurSyntheseLayer = {
    id: 'indicateur',
    'source-layer': 'departements',
    type: 'fill',
    paint: {
      'fill-color': expression,
      'fill-opacity': 0.7,
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
      <Layer {...indicateurSyntheseLayer} />
    </Source>
  )
}

export const interactiveLayersIds = []
