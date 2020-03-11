import colors from '../../styles/colors'

export const regionLayer = {
  id: 'region',
  type: 'circle',
  source: 'regions',
  filter: ['>', 'casConfirmes', 0],
  paint: {
    'circle-opacity': 0.6,
    'circle-color': colors.red,
    'circle-radius': [
      'step',
      ['get', 'casConfirmes'],
      10,
      10,
      20,
      20,
      30,
      30,
      40,
      40,
      50
    ]
  }
}

export const regionCountLayer = {
  id: 'region-count',
  type: 'symbol',
  source: 'regions',
  filter: ['>', 'casConfirmes', 0],
  layout: {
    'text-field': '{casConfirmes}',
    'text-size': 12
  }
}
