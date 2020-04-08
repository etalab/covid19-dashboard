import React from 'react'
import PropTypes from 'prop-types'
import ReactMapGL, {Source, Layer} from 'react-map-gl'

const Map = ({zoom, latitude, longitude, data, layers, onHover, onClick, children}) => (
  <ReactMapGL
    reuseMaps
    zoom={zoom}
    latitude={latitude}
    longitude={longitude}
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

Map.defaultProps = {
  onHover: null,
  onClick: null,
  children: null
}

Map.propTypes = {
  zoom: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  layers: PropTypes.array.isRequired,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node
}

export default Map
