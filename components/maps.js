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
    properties: 'deces',
    layers: [decesLayer, decesCountLayer]
  },
  {
    name: 'Carte des hospitalisations',
    properties: 'hospitalises',
    layers: [hospitalisesLayer, hospitalisesCountLayer]
  },
  {
    name: 'Carte des patients en réanimation',
    properties: 'reanimation',
    layers: [reanimationLayer, reanimationCountLayer]
  },
  {
    name: 'Carte des retours à domicile',
    properties: 'gueris',
    layers: [guerisLayer, guerisCountLayer]
  }
]

export default maps
