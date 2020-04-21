import {
  testsRealisesLayer,
  testsRealisesCountLayer,
  testsPositifsLayer,
  testsPositifsCountLayer
} from '../../react-map-gl/layers'

const maps = [
  {
    name: 'Carte des tests effectués',
    properties: 'testsRealises',
    layers: [testsRealisesLayer, testsRealisesCountLayer]
  },
  {
    name: 'Carte des tests positifs',
    properties: 'testPositifs',
    layers: [testsPositifsLayer, testsPositifsCountLayer]
  }
]

export default maps
