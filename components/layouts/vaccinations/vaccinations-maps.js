import colors from '../../../styles/colors'
import {CountMap, interactiveLayersIds} from '../../map-types/count-map'

const maps = [
  {
    name: 'Nombre des nouvelles premières injections réalisées',
    type: CountMap,
    interactiveLayersIds,
    property: 'nouvellesPremieresInjections',
    color: colors.green,
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'Nombre de premières injections réalisées',
    type: CountMap,
    interactiveLayersIds,
    property: 'cumulPremieresInjections',
    color: colors.green,
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'Nombre total de doses en stock',
    type: CountMap,
    interactiveLayersIds,
    property: 'stockNombreTotalDoses',
    color: colors.darkGrey,
    radiusBounds: [0, 10, 800, 70]
  }
]

export default maps
