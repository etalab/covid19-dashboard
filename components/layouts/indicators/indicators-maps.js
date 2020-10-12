import React from 'react'
import {IndicatorsMap, HoveredInfos, onSelect, interactiveLayersIds} from './indicators-map'

const maps = [
  {
    name: 'Taux d’occupation des lits en réanimation',
    type: IndicatorsMap,
    property: 'tauxOccupationRea',
    onSelect,
    hovered: (feature, options) => <HoveredInfos feature={feature} options={options} />,
    interactiveLayersIds
  },
  {
    name: 'Taux d’incidence',
    type: IndicatorsMap,
    property: 'tauxIncidence',
    onSelect,
    hovered: (feature, options) => <HoveredInfos feature={feature} options={options} />,
    interactiveLayersIds
  },
  {
    name: 'R - Nombre de reproduction effectif',
    type: IndicatorsMap,
    property: 'tauxReproductionEffectif',
    onSelect,
    hovered: (feature, options) => <HoveredInfos feature={feature} options={options} />,
    interactiveLayersIds
  },
  {
    name: 'Taux de positivité des tests RT-PCR',
    type: IndicatorsMap,
    property: 'tauxPositiviteTests',
    onSelect,
    hovered: (feature, options) => <HoveredInfos feature={feature} options={options} />,
    interactiveLayersIds
  }
]

export default maps
