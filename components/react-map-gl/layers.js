import colors from '../../styles/colors'

export const regionLayer = {
  id: 'region',
  type: 'circle',
  source: 'regions',
  filter: ['>', 'casConfirmes', 0],
  paint: {
    'circle-opacity': 0.6,
    'circle-color': colors.orange,
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['sqrt', ['number', ['get', 'casConfirmes']]],
      0,
      10,
      50,
      80
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
    'text-size': 16
  }
}
