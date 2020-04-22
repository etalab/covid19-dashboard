import {
  testsRealisesLayer,
  testsRealisesCountLayer,
  testsPositifsLayer,
  testsPositifsCountLayer
} from '../../react-map-gl/layers'

const maps = [
  {
    name: 'Tests réalisés en laboratoires de ville - ce jour',
    properties: 'testsRealises',
    layers: [testsRealisesLayer, testsRealisesCountLayer]
  },
  {
    name: 'Tests positifs en laboratoires de ville - ce jour',
    properties: 'testPositifs',
    layers: [testsPositifsLayer, testsPositifsCountLayer]
  }
]

export default maps
