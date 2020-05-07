import React from 'react'
import {SyntheseMap, HoveredInfos, interactiveLayersIds} from './synthese-map'

const maps = [
  {
    name: 'Carte d’activité épidémique',
    type: SyntheseMap,
    disableFitbound: true,
    onSelect: ({properties}) => `DEP-${properties.code}`,
    hovered: feature => <HoveredInfos feature={feature} />,
    interactiveLayersIds
  }
]

export default maps
