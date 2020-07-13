import colors from '../../../styles/colors'
import {CountMap, interactiveLayersIds} from '../../map-types/count-map'

const maps = [
  {
    name: 'Tests réalisés - ce jour',
    type: CountMap,
    interactiveLayersIds,
    property: 'testsRealises',
    color: colors.darkGrey
  },
  {
    name: 'Tests positifs - ce jour',
    type: CountMap,
    interactiveLayersIds,
    property: 'testsPositifs',
    color: colors.red
  }
]

export default maps
