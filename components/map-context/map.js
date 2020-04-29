import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import ReactMapGL from 'react-map-gl'

import useBounds from '../hooks/bounds'

const Map = ({code, interactiveLayerIds, hideAttribution, onHover, onClick, children}) => {
  const mapRef = useRef()
  const [viewport] = useBounds(mapRef, code)

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
