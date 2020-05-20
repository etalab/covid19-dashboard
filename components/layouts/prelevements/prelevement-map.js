import React, {useState, useContext, useEffect, useRef} from 'react'
import ReactMapGL, {Source, Layer, Popup} from 'react-map-gl'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import PlaceSumup from './place-sumup'
import {PrelevementsContext} from '.'

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 5
}

const zoomLevel = {
  housenumber: 18,
  street: 16,
  locality: 15,
  municipality: 12
}

const circleRadius = {
  base: 1.75,
  stops: [
    [5, 4],
    [12, 8],
    [18, 10]
  ]
}

const PrelevementsMap = () => {
  const mapRef = useRef()

  const {isMobileDevice} = useContext(AppContext)
  const {prelevementsSites, address, selectedPlace, hoveredPlace, setPlaces, setSelectedPlace} = useContext(PrelevementsContext)

  const [viewport, setViewport] = useState(defaultViewport)
  const [hovered, setHovered] = useState(null)

  const selectedPlaceId = selectedPlace ? selectedPlace.id : ''
  const hoveredPlaceId = hoveredPlace ? hoveredPlace.id : ''

  const publicPlaceLayer = {
    id: 'public-place',
    type: 'circle',
    paint: {
      'circle-color': [
        'case',
        ['==', ['get', 'id'], selectedPlaceId],
        colors.blue,
        ['==', ['get', 'id'], hoveredPlaceId],
        colors.blue,
        colors.green
      ],
      'circle-radius': circleRadius
    },
    filter: ['==', ['get', 'isPublic'], true]
  }
  const limitedAccessPlaceLayer = {
    id: 'limited-access',
    type: 'circle',
    paint: {
      'circle-color': [
        'case',
        ['==', ['get', 'id'], selectedPlaceId],
        colors.blue,
        ['==', ['get', 'id'], hoveredPlaceId],
        colors.blue,
        colors.orange
      ],
      'circle-radius': circleRadius
    },
    filter: ['==', ['get', 'isPublic'], false]
  }

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

  const onClick = event => {
    event.stopPropagation()
    const feature = event.features && event.features[0]

    if (feature) {
      const {id} = feature.properties
      const place = prelevementsSites.features.find(({properties}) => properties.id === id)

      setSelectedPlace(place.properties)
    }

    setHovered(null)
  }

  useEffect(() => {
    if (selectedPlace) {
      const {longitude, latitude} = selectedPlace
      setViewport({
        longitude: Number(longitude),
        latitude: Number(latitude),
        zoom: 15
      })
    }
  }, [selectedPlace])

  useEffect(() => {
    if (address) {
      const [longitude, latitude] = address.geometry.coordinates
      setViewport({
        longitude,
        latitude,
        zoom: zoomLevel[address.properties.type]
      })
    }
  }, [address])

  useEffect(() => {
    if (mapRef && mapRef.current && viewport.zoom >= 10) {
      const features = mapRef.current.queryRenderedFeatures(null, {layers: ['public-place', 'limited-access']})
      const visiblePlaces = features.map(f => f.properties.id)
      setPlaces(prelevementsSites.features.filter(({properties}) => visiblePlaces.includes(properties.id)).map(({properties}) => properties))
    }
  }, [mapRef, viewport, setPlaces, prelevementsSites])

  return (
    <ReactMapGL
      ref={mapRef}
      {...viewport}
      width='100%'
      height='100%'
      mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
      onViewportChange={setViewport}
      interactiveLayerIds={['public-place', 'limited-access']}
      onHover={isMobileDevice ? null : onHover}
      onClick={onClick}
    >
      <Source data={prelevementsSites} type='geojson'>
        <Layer {...publicPlaceLayer} />
        <Layer {...limitedAccessPlaceLayer} />
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
          <PlaceSumup {...hovered.feature.properties} />
        </Popup>
      )}
    </ReactMapGL>
  )
}

export default PrelevementsMap
