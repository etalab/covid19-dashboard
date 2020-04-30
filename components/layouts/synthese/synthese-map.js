import React, {useContext, useMemo} from 'react'
import {StaticMap, Source, Layer} from 'react-map-gl'

import colors from '../../../styles/colors'
import {SyntheseContext} from '.'
import {AppContext} from '../../../pages'

const COLORS = {
  vert: colors.green,
  orange: colors.orange,
  rouge: colors.red
}

const SyntheseMap = () => {
  const {isMobileDevice} = useContext(AppContext)
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
    <StaticMap
      latitude={46.7}
      longitude={2.7}
      zoom={isMobileDevice ? 3.8 : 5}
      width='100%'
      height='100%'
      mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
    >
      <Source
        id='decoupage-administratif'
        type='vector'
        url='https://etalab-tiles.fr/data/decoupage-administratif.json'
      >
        <Layer {...indicateurSyntheseLayer} />
      </Source>
    </StaticMap>
  )
}

export default SyntheseMap
