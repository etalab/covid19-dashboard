import {
  testsLayer,
  testsCountLayer,
  testsPositifsLayer,
  testsPositifsCountLayer
} from '../../react-map-gl/layers'

const maps = [
  {
    name: 'Carte des tests effectués',
    properties: 'tests',
    layers: [testsLayer, testsCountLayer]
  },
  {
    name: 'Carte des tests positifs',
    properties: 'testPositifs',
    layers: [testsPositifsLayer, testsPositifsCountLayer]
  }
]

export default maps
