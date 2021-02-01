import colors from '../../../styles/colors'
import {CountMap, interactiveLayersIds} from '../../map-types/count-map'

const maps = [
  {
    name: 'Premières injections réalisées (cumul)',
    type: CountMap,
    interactiveLayersIds,
    property: 'cumulPremieresInjections',
    color: colors.greenSoft,
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'Rendez-vous pris sur une semaine',
    type: CountMap,
    interactiveLayersIds,
    property: 'totalPrisesRendezVousSemaine',
    color: colors.darkGrey,
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'Rendez-vous pris sur une semaine (première injection)',
    type: CountMap,
    interactiveLayersIds,
    property: 'prisesRendezVousSemaineRang1',
    color: colors.blueSoft,
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'Rendez-vous pris sur une semaine (seconde injection)',
    type: CountMap,
    interactiveLayersIds,
    property: 'prisesRendezVousSemaineRang2',
    color: colors.purple,
    radiusBounds: [0, 10, 300, 70]
  }
]

export default maps
