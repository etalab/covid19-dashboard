import colors from '../../../styles/colors'
import {CountMap, interactiveLayersIds} from '../../map-types/count-map'

const maps = [
  {
    name: 'Nombre de doses en stock (tout type)',
    type: CountMap,
    interactiveLayersIds,
    property: 'stockNombreTotalDoses',
    color: colors.darkGrey,
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'Nombre de doses en stock (Pfizer)',
    type: CountMap,
    interactiveLayersIds,
    property: 'stockNombreDosesPfizer',
    color: colors.darkBlue,
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'Nombre de doses en stock (Moderna)',
    type: CountMap,
    interactiveLayersIds,
    property: 'stockNombreDosesModerna',
    color: colors.darkRed,
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'Doses livrées (tout type)',
    type: CountMap,
    interactiveLayersIds,
    property: 'livraisonsCumulNombreTotalDoses',
    color: colors.darkGrey,
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'Doses livrées (Pfizer) ',
    type: CountMap,
    interactiveLayersIds,
    property: 'livraisonsCumulNombreDosesPfizer',
    color: colors.darkBlue,
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'Doses livrées (Moderna) ',
    type: CountMap,
    interactiveLayersIds,
    property: 'livraisonsCumulNombreDosesModerna',
    color: colors.darkRed,
    radiusBounds: [0, 10, 800, 70]
  }
]

export default maps
