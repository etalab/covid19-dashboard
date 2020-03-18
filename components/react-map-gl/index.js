import React, {useState, useCallback, useContext} from 'react'
import ReactMapGL, {Source, Layer, Popup} from 'react-map-gl'

import {AppContext} from '../../pages'

import SumUp from './sumup'

import {casConfirmesLayer, casConfirmesCountLayer} from './layers'

const settings = {
  maxZoom: 16
}

const Map = () => {
  const {viewport, regionsReport, setViewport} = useContext(AppContext)

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
      <ReactMapGL
        ReuseMaps
        ref={mapRef}
        {...viewport}
        width='100%'
        height='100%'
        mapStyle='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
        {...settings}
        interactiveLayerIds={[regionLayer.id]}
        onViewportChange={setViewport}
        onHover={onHover}
      >

        <Source
          type='geojson'
          id='cas-confirmes'
        >
          <Layer {...casConfirmesLayer} />
          <Layer {...casConfirmesCountLayer} />
        </Source>

        {hovered && (
          <Popup
            longitude={hovered.longitude}
            latitude={hovered.latitude}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setHovered(null)}
            anchor='top'
            offsetTop={20}
          >
            <SumUp {...hovered.feature.properties} />
          </Popup>
        )}
      </ReactMapGL>
      <style jsx>{`
        .map-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}

export default Map
