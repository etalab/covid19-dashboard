import {
  decesLayer,
  decesCountLayer,
  hospitalisesLayer,
  hospitalisesCountLayer,
  reanimationLayer,
  reanimationCountLayer,
  guerisLayer,
  guerisCountLayer
} from './react-map-gl/layers'

const maps = [
  {
    name: 'Carte des décès à l’hôpital',
    category: 'régionale',
    granularity: 'regions',
    properties: 'deces',
    layers: [decesLayer, decesCountLayer]
  },
  {
    name: 'Carte des hospitalisations',
    category: 'régionale',
    properties: 'hospitalises',
    granularity: 'regions',
    layers: [hospitalisesLayer, hospitalisesCountLayer]
  },
  {
    name: 'Carte des patients en réanimation',
    category: 'régionale',
    properties: 'reanimation',
    granularity: 'regions',
    layers: [reanimationLayer, reanimationCountLayer]
  },
  {
    name: 'Carte des retours à domicile',
    category: 'régionale',
    properties: 'gueris',
    granularity: 'regions',
    layers: [guerisLayer, guerisCountLayer]
  },
  {
    name: 'Carte des décès à l’hôpital',
    category: 'départementale',
    granularity: 'departements',
    properties: 'deces',
    layers: [decesLayer, decesCountLayer]
  },
  {
    name: 'Carte des hospitalisations',
    category: 'départementale',
    properties: 'hospitalises',
    granularity: 'departements',
    layers: [hospitalisesLayer, hospitalisesCountLayer]
  },
  {
    name: 'Carte des patients en réanimation',
    category: 'départementale',
    properties: 'reanimation',
    granularity: 'departements',
    layers: [reanimationLayer, reanimationCountLayer]
  },
  {
    name: 'Carte des retours à domicile',
    category: 'départementale',
    properties: 'gueris',
    granularity: 'departements',
    layers: [guerisLayer, guerisCountLayer]
  }
]

export default maps
