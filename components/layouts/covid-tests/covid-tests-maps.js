import colors from '../../styles/colors'

const testsRealisesLayer = {
  id: 'testsRealises',
  type: 'circle',
  source: 'testsRealises',
  filter: ['>', 'testsRealises', 0],
  paint: {
    'circle-opacity': 0.6,
    'circle-color': colors.darkGrey,
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['sqrt', ['number', ['get', 'testsRealises']]],
      0,
      10,
      100,
      70
    ]
  }
}

const testsRealisesCountLayer = {
  id: 'testsRealises-count',
  type: 'symbol',
  source: 'testsRealises',
  filter: ['>', 'testsRealises', 0],
  layout: {
    'text-field': '{testsRealises}',
    'text-size': 16
  }
}

const testsPositifsLayer = {
  id: 'testsPositifs',
  type: 'circle',
  source: 'testsPositifs',
  filter: ['>', 'testsPositifs', 0],
  paint: {
    'circle-opacity': 0.6,
    'circle-color': colors.red,
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['sqrt', ['number', ['get', 'testsPositifs']]],
      0,
      10,
      100,
      70
    ]
  }
}

export const testsPositifsCountLayer = {
  id: 'testsPositifs-count',
  type: 'symbol',
  source: 'testsPositifs',
  filter: ['>', 'testsPositifs', 0],
  layout: {
    'text-field': '{testsPositifs}',
    'text-size': 16
  }
}

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
