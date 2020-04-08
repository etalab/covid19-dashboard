import React, {useState, useCallback, useContext} from 'react'
import ReactMapGL, {Source, Layer, Popup} from 'react-map-gl'
import Router from 'next/router'
import {Maximize2} from 'react-feather'
import {groupBy} from 'lodash'

import {AppContext} from '../../pages'

import MapSelector from '../map-selector'
import centers from '../../centers.json'

import SumUp from './sumup'
import Statistics from '../statistics'

import {
  decesLayer,
  decesCountLayer,
  hospitalisesLayer,
  hospitalisesCountLayer,
  reanimationLayer,
  reanimationCountLayer,
  guerisLayer,
  guerisCountLayer
} from './layers'

const SITE_URL = process.env.SITE_URL

const settings = {
  maxZoom: 10
}

const LAYERS = [
  decesLayer,
  decesCountLayer,
  hospitalisesLayer,
  hospitalisesCountLayer,
  reanimationLayer,
  reanimationCountLayer,
  guerisLayer,
  guerisCountLayer
]

const reportToGeoJSON = (report, date) => {
  const byCode = groupBy(report.history, 'code')
  return {
    type: 'FeatureCollection',
    features: Object.keys(byCode).filter(code => Boolean(centers[code])).map(code => {
      const selectedDateAvailable = byCode[code].find(r => r.date === date)
      const properties = selectedDateAvailable ? selectedDateAvailable : {code}

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: centers[code]
        },
        properties: {
          ...properties,
          ...byCode[code].find(r => r.date === date),
          history: byCode[code].filter(r => date >= r.date)
        }
      }
    }).filter(i => Boolean(i))
  }
}

const Map = () => {
  const [selectedMapIdx, setSelectedMapIdx] = useState(1)
  const DEFAULT_DATA = 'hospitalises'

  const {
    date,
    selectedLocationReport,
    selectedData,
    isIframe,
    viewport,
    mapReport,
    setViewport,
    isMobileDevice
  } = useContext(AppContext)

  const layers = LAYERS.filter(layer => layer.id.startsWith(selectedData || DEFAULT_DATA))
  const [map, setMap] = useState()
  const [hovered, setHovered] = useState(null)

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [])

  const getGeoJSONFromReport = useCallback(() => {
    if (mapReport) {
      return reportToGeoJSON(mapReport, date)
    }
  }, [mapReport, date])

  const onHover = event => {
    event.stopPropagation()
    const feature = event.features && event.features[0]
    const [longitude, latitude] = event.lngLat
    let hoverInfo

    if (feature) {
      hoverInfo = {
        longitude,
        latitude,
        feature
      }
    }

    setHovered(hoverInfo)
  }

  const onClick = event => {
    event.stopPropagation()
    const feature = event.features && event.features[0]

    if (feature) {
      const [typeTerritoire, codeTerritoire] = feature.properties.code.split('-')
      Router.push({
        pathname: '/',
        query: {
          location: feature.properties.code
        }
      }, `/${typeTerritoire === 'REG' ? 'regions' : 'departements'}/${codeTerritoire}`)
    } else {
      Router.push({
        pathname: '/'
      })
    }

    setHovered(null)
  }

  return (
    <div className='map-container'>
      <div className='controls'>
        <div className='control'>
          <MapSelector mapIdx={selectedMapIdx} selectMap={setSelectedMapIdx} />
        </div>

        {isIframe && (
          <div className='control maximize'>
            <a href={SITE_URL} target='_top'><Maximize2 style={{verticalAlign: 'middle'}} /></a>
          </div>
        )}
      </div>

      <ReactMapGL
        reuseMaps
        ref={mapRef}
        {...viewport}
        width='100%'
        height='100%'
        mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
        {...settings}
        interactiveLayerIds={layers.map(layer => layer.id)}
        onViewportChange={setViewport}
        onHover={isMobileDevice ? null : onHover}
        onClick={onClick}
      >

        {mapReport && (
          <Source
            type='geojson'
            attribution='Données Santé publique France'
            data={getGeoJSONFromReport()}
          >
            {layers.map(layer => (
              <Layer key={layer.id} {...layer} />
            ))}
          </Source>
        )}

        {hovered && (
          <Popup
            longitude={hovered.longitude}
            latitude={hovered.latitude}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setHovered(null)}
            anchor='bottom-left'
          >
            <SumUp nom={hovered.feature.properties.nom} />
          </Popup>
        )}
      </ReactMapGL>

      {isMobileDevice && (
        <div className={`mobile-sumup ${selectedLocationReport ? 'show' : 'hide'}`}>
          {selectedLocationReport && (
            <Statistics />
          )}
        </div>
      )}

      <style jsx>{`
        .map-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .controls {
          z-index: 1;
          position: absolute;
          display: flex;
          justify-content: space-between;
          align-items: start;
          width: 100%;
          padding: 0.5em;
        }

        .control {
          background-color: #000000aa;
          color: #fff;
          border-radius: 4px;
          margin: 0;
        }

        .maximize {
          display: flex;
          right: 0;
          border-radius: 4px;
          background: #53514f;
        }

        .maximize a {
          color: #fff;
          padding: 0.4em;
        }

        .mobile-sumup {
          z-index: 2;
          position: absolute;
          bottom: 0;
          background-color: #fff;
          width: 100%;
          margin: auto;
          transition: 0.5s;
        }

        .mobile-sumup.hide {
          height: 0;
          padding: 0;
        }

        .mobile-sumup.show {
          height: 100%;
        }
      `}</style>
    </div>
  )
}

export default Map
