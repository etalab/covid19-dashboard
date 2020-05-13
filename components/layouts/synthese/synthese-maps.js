import React from 'react'
import {SyntheseMap, HoveredInfos, onSelect, interactiveLayersIds} from './synthese-map'

const maps = [
  {
    name: 'Carte d’activité épidémique',
    type: SyntheseMap,
    onSelect,
    hovered: feature => <HoveredInfos feature={feature} />,
    interactiveLayersIds
  }
]

export default maps
