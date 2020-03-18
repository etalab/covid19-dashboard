import colors from '../../styles/colors'

export const casConfirmesLayer = {
  id: 'cas-confirmes',
  type: 'circle',
  source: 'cas-confirmes',
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
      60,
      80
    ]
  }
}

export const casConfirmesCountLayer = {
  id: 'cas-confirmes-count',
  type: 'symbol',
  source: 'cas-confirmes',
  filter: ['>', 'casConfirmes', 0],
  layout: {
    'text-field': '{casConfirmes}',
    'text-size': 16
  }
}
