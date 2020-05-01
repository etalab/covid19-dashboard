import colors from '../../styles/colors'

const decesLayer = {
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

const decesCountLayer = {
  id: 'deces-count',
  type: 'symbol',
  source: 'deces',
  filter: ['>', 'deces', 0],
  layout: {
    'text-field': '{deces}',
    'text-size': 16
  }
}

const guerisLayer = {
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

const guerisCountLayer = {
  id: 'gueris-count',
  type: 'symbol',
  source: 'gueris',
  filter: ['>', 'gueris', 0],
  layout: {
    'text-field': '{gueris}',
    'text-size': 16
  }
}

const hospitalisesLayer = {
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

const hospitalisesCountLayer = {
  id: 'hospitalises-count',
  type: 'symbol',
  source: 'hospitalises',
  filter: ['>', 'hospitalises', 0],
  layout: {
    'text-field': '{hospitalises}',
    'text-size': 16
  }
}

const reanimationLayer = {
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

const reanimationCountLayer = {
  id: 'reanimation-count',
  type: 'symbol',
  source: 'reanimation',
  filter: ['>', 'reanimation', 0],
  layout: {
    'text-field': '{reanimation}',
    'text-size': 16
  }
}

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
