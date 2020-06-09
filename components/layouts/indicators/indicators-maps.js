import React from 'react'
import {IndicatorsMap, HoveredInfos, onSelect, interactiveLayersIds} from './indicators-map'

const maps = [
  {
    name: 'Taux d’incidence',
    type: IndicatorsMap,
    property: 'tauxIncidence',
    onSelect,
    hovered: feature => <HoveredInfos feature={feature} />,
    interactiveLayersIds
  },
  {
    name: 'Taux de reproduction effectif',
    type: IndicatorsMap,
    property: 'tauxReproductionEffectif',
    onSelect,
    hovered: feature => <HoveredInfos feature={feature} />,
    interactiveLayersIds
  },
  {
    name: 'Taux d’occupation des lits en réa',
    type: IndicatorsMap,
    property: 'tauxOccupationRea',
    onSelect,
    hovered: feature => <HoveredInfos feature={feature} />,
    interactiveLayersIds
  },
  {
    name: 'Taux de positivité des tests RT-PCR',
    type: IndicatorsMap,
    property: 'tauxPositiviteTests',
    onSelect,
    hovered: feature => <HoveredInfos feature={feature} />,
    interactiveLayersIds
  }
]

export default maps
