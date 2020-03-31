import React, {useContext} from 'react'
import {StaticMap, Source, Layer} from 'react-map-gl'

import {AppContext} from '../../pages'

import {getReport, reportToGeoJSON} from '../../lib/data'

import maps from '../maps'

const DOMS = [
  {
    name: 'Guadeloupe',
    code: 'REG-01',
    latitude: 16.172,
    longitude: -61.406,
    zoom: 7
  },
  {
    name: 'Martinique',
    code: 'REG-02',
    latitude: 14.637,
    longitude: -61.02,
    zoom: 7
  },
  {
    name: 'Guyane',
    code: 'REG-03',
    latitude: 3.931,
    longitude: -53.119,
    zoom: 5
  },
  {
    name: 'La Réunion',
    code: 'REG-04',
    latitude: -21.13,
    longitude: 55.527,
    zoom: 7
  },
  {
    name: 'Mayotte',
    code: 'REG-06',
    latitude: -12.818,
    longitude: 45.158,
    zoom: 7
  }
]

const Drom = () => {
  const {date, selectedMapIdx} = useContext(AppContext)
  const currentMap = maps[selectedMapIdx]

  return (
    <div className='drom-grid'>

      {DOMS.map(({code, latitude, longitude, zoom}) => {
        const report = getReport(date, currentMap.granularity === 'regions' ? 'REG' : 'DEP')
        const layerData = reportToGeoJSON(report, date)
        return (
          <StaticMap
            key={code}
            zoom={zoom}
            latitude={latitude}
            longitude={longitude}
            width='100%'
            height='100%'
            mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
          >
            <Source
              type='geojson'
              attribution='Données Santé publique France'
              data={layerData}
            >
              {maps[selectedMapIdx].layers.map(layer => (
                <Layer key={layer.id} {...layer} />
              ))}
            </Source>
          </StaticMap>
        )
      })}

      <style jsx>{`
          .drom-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            grid-gap: 0.5em;
            align-items: center;
            height: 100%;
          }
        `}</style>
    </div>
  )
}

export default Drom
