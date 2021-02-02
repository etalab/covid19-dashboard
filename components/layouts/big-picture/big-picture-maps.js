import colors from '../../../styles/colors'
import {CountMap, interactiveLayersIds} from '../../map-types/count-map'

const maps = [
  {
    name: 'Nombre de premières doses injectées',
    type: CountMap,
    interactiveLayersIds,
    property: 'cumulPremieresInjections',
    color: colors.green,
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'Carte des décès à l’hôpital',
    type: CountMap,
    interactiveLayersIds,
    property: 'deces',
    color: colors.red
  },
  {
    name: 'Carte des hospitalisations',
    type: CountMap,
    interactiveLayersIds,
    property: 'hospitalises',
    color: colors.darkGrey
  },
  {
    name: 'Carte des nouveaux patients hospitalisés',
    type: CountMap,
    interactiveLayersIds,
    property: 'nouvellesHospitalisations',
    color: colors.darkGrey
  },
  {
    name: 'Carte des patients en réanimation',
    type: CountMap,
    interactiveLayersIds,
    property: 'reanimation',
    color: colors.darkerGrey
  },
  {
    name: 'Carte des nouveaux patients en réanimation',
    type: CountMap,
    interactiveLayersIds,
    property: 'nouvellesReanimations',
    color: colors.darkGrey
  },
  {
    name: 'Carte des retours à domicile',
    type: CountMap,
    interactiveLayersIds,
    property: 'gueris',
    color: colors.green
  }
]

export default maps
