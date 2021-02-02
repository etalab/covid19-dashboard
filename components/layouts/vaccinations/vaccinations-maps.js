import colors from '../../../styles/colors'
import {CountMap, interactiveLayersIds} from '../../map-types/count-map'
import indicateurs from './indicateurs'

const maps = indicateurs.map(indicateur => ({
  name: `Nombre de ${indicateur.label}`,
  type: CountMap,
  interactiveLayersIds,
  property: indicateur.name,
  color: colors[indicateur.color],
  radiusBounds: indicateur.radiusBounds
}))

export default maps
