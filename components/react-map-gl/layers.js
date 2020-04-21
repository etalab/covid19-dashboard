import colors from '../../styles/colors'

export const testsLayer = {
  id: 'tests',
  type: 'circle',
  source: 'tests',
  filter: ['>', 'tests', 0],
  paint: {
    'circle-opacity': 0.6,
    'circle-color': colors.darkGrey,
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['sqrt', ['number', ['get', 'tests']]],
      0,
      10,
      100,
      70
    ]
  }
}

export const testsCountLayer = {
  id: 'tests-count',
  type: 'symbol',
  source: 'tests',
  filter: ['>', 'tests', 0],
  layout: {
    'text-field': '{tests}',
    'text-size': 16
  }
}

export const testsPositifsLayer = {
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

export const decesLayer = {
  id: 'deces',
  type: 'circle',
  source: 'deces',
  filter: ['>', 'deces', 0],
  paint: {
    'circle-opacity': 0.6,
    'circle-color': colors.red,
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['sqrt', ['number', ['get', 'deces']]],
      0,
      10,
      100,
      70
    ]
  }
}

export const decesCountLayer = {
  id: 'deces-count',
  type: 'symbol',
  source: 'deces',
  filter: ['>', 'deces', 0],
  layout: {
    'text-field': '{deces}',
    'text-size': 16
  }
}

export const guerisLayer = {
  id: 'gueris',
  type: 'circle',
  source: 'gueris',
  filter: ['>', 'gueris', 0],
  paint: {
    'circle-opacity': 0.6,
    'circle-color': colors.green,
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['sqrt', ['number', ['get', 'gueris']]],
      0,
      10,
      100,
      70
    ]
  }
}

export const guerisCountLayer = {
  id: 'gueris-count',
  type: 'symbol',
  source: 'gueris',
  filter: ['>', 'gueris', 0],
  layout: {
    'text-field': '{gueris}',
    'text-size': 16
  }
}

export const hospitalisesLayer = {
  id: 'hospitalises',
  type: 'circle',
  source: 'hospitalises',
  filter: ['>', 'hospitalises', 0],
  paint: {
    'circle-opacity': 0.6,
    'circle-color': colors.darkGrey,
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['sqrt', ['number', ['get', 'hospitalises']]],
      0,
      10,
      100,
      70
    ]
  }
}

export const hospitalisesCountLayer = {
  id: 'hospitalises-count',
  type: 'symbol',
  source: 'hospitalises',
  filter: ['>', 'hospitalises', 0],
  layout: {
    'text-field': '{hospitalises}',
    'text-size': 16
  }
}

export const reanimationLayer = {
  id: 'reanimation',
  type: 'circle',
  source: 'reanimation',
  filter: ['>', 'reanimation', 0],
  paint: {
    'circle-opacity': 0.6,
    'circle-color': colors.darkerGrey,
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['sqrt', ['number', ['get', 'reanimation']]],
      0,
      10,
      100,
      70
    ]
  }
}

export const reanimationCountLayer = {
  id: 'reanimation-count',
  type: 'symbol',
  source: 'reanimation',
  filter: ['>', 'reanimation', 0],
  layout: {
    'text-field': '{reanimation}',
    'text-size': 16
  }
}
