import React, {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Popup} from 'react-map-gl'

import {AppContext} from '../../pages'

import Map from './map'
import SumUp from './sumup'

const MapContext = ({code, map, hidePopup, hideAttribution, disableClick}) => {
  const {selectedLayout, isMobileDevice} = useContext(AppContext)
  const MapType = map.type

  const [hovered, setHovered] = useState(null)

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

  const onClick = useCallback(event => {
    event.stopPropagation()
    const feature = event.features && event.features[0]
    let location
    let as = `/${selectedLayout.name}`

    if (feature) {
      const properties = map.onClick ? map.onClick(feature) : feature.properties
      location = properties.code
      as += `?location=${location}`
    }

    Router.push({
      pathname: '/',
      query: {
        ...Router.query,
        layout: selectedLayout.id,
        location
      }
    }, as)

    setHovered(null)
  }, [map, selectedLayout])

  return (
    <div className='map-container'>
      <Map
        code={code}
        interactiveLayerIds={map.interactiveLayersIds}
        hideAttribution={hideAttribution}
        onHover={isMobileDevice ? null : onHover}
        onClick={disableClick ? null : onClick}
      >
        <MapType code={code} map={map} hovered={hovered} />

        {hovered && !hidePopup && (
          <Popup
            longitude={hovered.longitude}
            latitude={hovered.latitude}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setHovered(null)}
            anchor='bottom-left'
          >
            <SumUp nom={hovered.feature.properties.nom}>
              {map.hovered && map.hovered(hovered.feature)}
            </SumUp>
          </Popup>
        )}
      </Map>

      <style jsx>{`
        .map-container {
          display: flex;
          position: relative;
          width: 100%;
          height: 100%;
        }

        .control {
          background-color: #000000aa;
          color: #fff;
          border-radius: 4px;
          margin: 0;
        }
      `}</style>
    </div>
  )
}

MapContext.defaultProps = {
  hidePopup: false,
  hideAttribution: false,
  disableClick: false
}

MapContext.propTypes = {
  code: PropTypes.string.isRequired,
  map: PropTypes.object.isRequired,
  hidePopup: PropTypes.bool,
  hideAttribution: PropTypes.bool,
  disableClick: PropTypes.bool
}

export default MapContext
