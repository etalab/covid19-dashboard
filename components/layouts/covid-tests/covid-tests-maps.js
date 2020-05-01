import colors from '../../../styles/colors'
import {CountMap, interactiveLayersIds} from '../../map-types/count-map'

const maps = [
  {
    name: 'Tests réalisés en laboratoires de ville - ce jour',
    type: CountMap,
    interactiveLayersIds,
    property: 'testsRealises',
    color: colors.darkGrey
  },
  {
    name: 'Tests positifs en laboratoires de ville - ce jour',
    type: CountMap,
    interactiveLayersIds,
    property: 'testsPositifs',
    color: colors.red
  }
]

export default maps
