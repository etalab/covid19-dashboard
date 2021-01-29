import colors from '../../../styles/colors'
import {CountMap, interactiveLayersIds} from '../../map-types/count-map'

const maps = [
  {
    name: 'Premières injections réalisées (sur une journée)',
    type: CountMap,
    interactiveLayersIds,
    property: 'nouvellesPremieresInjections',
    color: colors.green,
    radiusBounds: [0, 10, 200, 70]
  },
  {
    name: 'Premières injections réalisées (cumul)',
    type: CountMap,
    interactiveLayersIds,
    property: 'cumulPremieresInjections',
    color: colors.green,
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'Nombre de doses en stock (tout type) ',
    type: CountMap,
    interactiveLayersIds,
    property: 'stockNombreTotalDoses',
    color: colors.darkBlue,
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'Nombre de doses en stock (Pfizer) ',
    type: CountMap,
    interactiveLayersIds,
    property: 'stockNombreDosesPfizer',
    color: colors.darkBlue,
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'Nombre de doses en stock (Moderna) ',
    type: CountMap,
    interactiveLayersIds,
    property: 'stockNombreDosesModerna',
    color: colors.darkBlue,
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'Doses livrées (tout type) ',
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
    color: colors.darkGrey,
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'Doses livrées (Moderna) ',
    type: CountMap,
    interactiveLayersIds,
    property: 'livraisonsCumulNombreDosesModerna',
    color: colors.darkGrey,
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'Rendez-vous pris sur une semaine ',
    type: CountMap,
    interactiveLayersIds,
    property: 'totalPrisesRendezVousSemaine',
    color: colors.blue,
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'Rendez-vous pris sur une semaine (première injection) ',
    type: CountMap,
    interactiveLayersIds,
    property: 'prisesRendezVousSemaineRang1',
    color: colors.blue,
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'Rendez-vous pris sur une semaine (seconde injection) ',
    type: CountMap,
    interactiveLayersIds,
    property: 'prisesRendezVousSemaineRang2',
    color: colors.blue,
    radiusBounds: [0, 10, 300, 70]
  }
]

export default maps
