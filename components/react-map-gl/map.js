import React, {useState, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import ReactMapGL, {Source, Layer, WebMercatorViewport} from 'react-map-gl'

import {AppContext} from '../../pages'

import theme from '../../styles/theme'

import {droms, franceMetropolitan} from './maps'

const MENU_WIDTH = Number.parseInt(theme.menuWidth.split('px')[0], 10)

const Map = ({code, data, layers, onHover, onClick, children}) => {
  const {isMobileDevice} = useContext(AppContext)
  const [viewport, setViewport] = useState(null)
  const [isDrom, setIsDrom] = useState(false)

  const handleResize = useCallback(() => {
    if (window) {
      const drom = code ? droms.find(drom => drom.code === code) : null
      setIsDrom(Boolean(drom))
      const bounds = code ? drom.bounds : franceMetropolitan.bounds
      const width = isMobileDevice ? window.innerWidth : window.innerWidth - MENU_WIDTH
      const height = window.innerHeight

      if (width > 0) {
        const viewport = new WebMercatorViewport({width, height})
          .fitBounds(bounds, {
            padding: 30,
            offset: [0, -100]
          })

        setViewport({
          ...viewport,
          zoom: drom ? drom.zoom : viewport.zoom
        })
      }
    }
  }, [isMobileDevice, code])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  if (viewport) {
    const {zoom, latitude, longitude} = viewport
    return (
      <ReactMapGL
        reuseMaps
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
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
        attributionControl={!isDrom}
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
    )
  }

  return null
}

Map.defaultProps = {
  code: null,
  onHover: null,
  onClick: null,
  children: null
}

Map.propTypes = {
  code: PropTypes.string,
  data: PropTypes.object.isRequired,
  layers: PropTypes.array.isRequired,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node
}

export default Map
