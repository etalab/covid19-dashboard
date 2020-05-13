import {MasksMap, interactiveLayersIds} from './masks-map'

const maps = [
  {
    name: 'Entreprises productice de masques',
    type: MasksMap,
    onSelect: ({properties}) => `REG-${properties.code}`,
    interactiveLayersIds
  }
]

export default maps
