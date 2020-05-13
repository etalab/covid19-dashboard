import {useState, useCallback, useEffect} from 'react'
import {WebMercatorViewport} from 'react-map-gl'

import geo from '../../geo.json'

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 5
}

function useBounds(mapRef, code) {
  const [viewport, setViewport] = useState(defaultViewport)

  const handleResize = useCallback(() => {
    if (mapRef && mapRef.current) {
      const {width, height} = mapRef.current.getBoundingClientRect()

      const {bbox} = geo[code || 'FRA']
      const padding = width > 50 && height > 50 ? 20 : 0
      const viewport = new WebMercatorViewport({width, height})
        .fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {padding})

      setViewport(viewport)
    }
  }, [mapRef, code])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  return [viewport]
}

export default useBounds
