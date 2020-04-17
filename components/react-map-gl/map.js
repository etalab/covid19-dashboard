import React, {useState, useCallback, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import ReactMapGL, {Source, Layer, WebMercatorViewport} from 'react-map-gl'

import geo from '../../geo.json'

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 5
}

const Map = ({code, data, layers, hideAttribution, onHover, onClick, children}) => {
  const mapRef = useRef()

  const [viewport, setViewport] = useState(defaultViewport)

  const handleResize = useCallback(() => {
    if (mapRef && mapRef.current) {
      const {width, height} = mapRef.current.getBoundingClientRect()

      if (width > 50 && height > 50) {
        const {bbox} = geo[code]
        const viewport = new WebMercatorViewport({width, height})
          .fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {padding: 20})

        setViewport(viewport)
      }
    }
  }, [mapRef, code])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  return (
    <div ref={mapRef} className='react-map-container'>
      {viewport && (
        <ReactMapGL
          reuseMaps
          {...viewport}
          width='100%'
          height='100%'
          mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
          interactiveLayerIds={onHover || onClick ? layers.map(layer => layer.id) : null}
          onHover={onHover}
          onClick={onClick}
          scrollZoom={false}
          dragPan={false}
          dragRotate={false}
          doubleClickZoom={false}
          touchZoom={false}
          attributionControl={!hideAttribution}
        >
          <Source
            type='geojson'
            attribution='Données Santé publique France'
            data={data}
          >
            {layers.map(layer => (
              <Layer key={layer.id} {...layer} />
            ))}
          </Source>

          {children}
        </ReactMapGL>
      )}

      <style jsx>{`
          .react-map-container {
            flex: 1;
          }
          `}</style>
    </div>
  )
}

Map.defaultProps = {
  hideAttribution: false,
  onHover: null,
  onClick: null,
  children: null
}

Map.propTypes = {
  code: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  layers: PropTypes.array.isRequired,
  hideAttribution: PropTypes.bool,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node
}

export default Map
