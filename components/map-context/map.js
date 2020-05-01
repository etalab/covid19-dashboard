import React, {useState, useCallback, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import ReactMapGL, {WebMercatorViewport} from 'react-map-gl'

import geo from '../../geo.json'

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 5
}

const Map = ({code, interactiveLayerIds, hideAttribution, onHover, onClick, children}) => {
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
          {...viewport}
          width='100%'
          height='100%'
          mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
          interactiveLayerIds={interactiveLayerIds}
          onHover={onHover}
          onClick={onClick}
          scrollZoom={false}
          dragPan={false}
          dragRotate={false}
          doubleClickZoom={false}
          touchZoom={false}
          attributionControl={!hideAttribution}
        >
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
  children: null,
  interactiveLayerIds: null
}

Map.propTypes = {
  code: PropTypes.string.isRequired,
  interactiveLayerIds: PropTypes.array,
  hideAttribution: PropTypes.bool,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node
}

export default Map
