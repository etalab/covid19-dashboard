import React, {useState, useCallback, useContext} from 'react'
import ReactMapGL, {Source, Layer, Popup} from 'react-map-gl'
import {Maximize2} from 'react-feather'

import {AppContext} from '../../pages'

import SumUp from './sumup'

import MapSelector from '../map-selector'

const settings = {
  maxZoom: 16
}

const Map = () => {
  const [selectedMapIdx, setSelectedMapIdx] = useState(0)

  const app = useContext(AppContext)

  const [map, setMap] = useState()
  const [hovered, setHovered] = useState(null)

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [])

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

  return (
    <div className='map-container'>
      <div className='controls'>
        <div className='control'>
          <MapSelector mapIdx={selectedMapIdx} selectMap={setSelectedMapIdx} />
        </div>

        {app.isIframe && (
          <div className='control maximize'>
            <a href='https://veille-coronavirus.fr/'><Maximize2 style={{verticalAalign: 'middle'}} /></a>
          </div>
        )}
      </div>

      <ReactMapGL
        ReuseMaps
        ref={mapRef}
        {...app.viewport}
        width='100%'
        height='100%'
        mapStyle='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
        {...settings}
        interactiveLayerIds={app.maps[selectedMapIdx].layers.map(layer => layer.id)}
        onViewportChange={app.setViewport}
        onHover={onHover}
      >

        <Source
          type='geojson'
          id='cas-confirmes'
          data={app.maps[selectedMapIdx].data}
        >
          {app.maps[selectedMapIdx].layers.map(layer => (
            <Layer key={layer.id} {...layer} />
          ))}
        </Source>

        {hovered && (
          <Popup
            longitude={hovered.longitude}
            latitude={hovered.latitude}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setHovered(null)}
            anchor='bottom-left'
          >
            <SumUp data={JSON.parse(hovered.feature.properties.history)} {...hovered.feature.properties} />
          </Popup>
        )}
      </ReactMapGL>

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
          align-items: end;
          width: 100%;
        }

        .control {
          background-color: #000000aa;
          color: #fff;
          border-radius: 4px;
          margin: ${app.isMobileDevice ? '0.5em auto' : '0.5em'};
        }

        .maximize {
          display: flex;
          right: 0;
          border-radius: 4px;
          background: #53514f;
        }

        .maximize a {
          color: #fff;
          padding: 0.4em 0.4em 0.2em 0.4em;
        }
      `}</style>
    </div>
  )
}

export default Map
