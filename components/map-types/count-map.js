import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-map-gl'

import {AppContext} from '../../pages'
import {getReport, reportToGeoJSON} from '../../lib/data'

export const CountMap = ({code, map}) => {
  const {date, forcedDate} = useContext(AppContext)
  const [layerData, setLayerData] = useState(null)

  const selectedDate = forcedDate || date

  useEffect(() => {
    async function prepareLayerData() {
      const report = await getReport(selectedDate, code === 'FRA' ? 'REG' : 'DEP')
      setLayerData(reportToGeoJSON(report, selectedDate))
    }

    prepareLayerData()
  }, [selectedDate, code])

  const radiusBounds = map.radiusBounds || [0, 10, 100, 70]

  const circleLayer = {
    id: 'circle-layer',
    type: 'circle',
    source: map.property,
    filter: ['>', map.property, 0],
    paint: {
      'circle-opacity': 0.6,
      'circle-color': map.color,
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['sqrt', ['number', ['get', map.property]]],
        ...radiusBounds
      ]
    }
  }

  const countLayer = {
    id: 'count-layer',
    type: 'symbol',
    source: map.property,
    filter: ['>', map.property, 0],
    layout: {
      'text-field': `{${map.property}}`,
      'text-size': 16
    }
  }

  return (
    <>
      {layerData &&
        <Source
          type='geojson'
          attribution='Données Santé publique France'
          data={layerData}
        >
          <Layer key={circleLayer.id} {...circleLayer} />
          <Layer key={countLayer.id} {...countLayer} />
        </Source>}
    </>
  )
}

CountMap.propTypes = {
  code: PropTypes.string.isRequired,
  map: PropTypes.object.isRequired
}

export const interactiveLayersIds = [
  'circle-layer'
]
