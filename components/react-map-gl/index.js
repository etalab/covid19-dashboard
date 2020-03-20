import React, {useState, useCallback, useContext} from 'react'
import ReactMapGL, {Source, Layer, Popup} from 'react-map-gl'

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
      <div className='control'>
        <MapSelector mapIdx={selectedMapIdx} selectMap={setSelectedMapIdx} />
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

        .control {
          z-index: 1;
          position: absolute;
          margin: 0.5em;
          width: ${app.isMobileDevice ? 'calc(100% - 1em)' : 'none'};
        }
      `}</style>
    </div>
  )
}

export default Map
