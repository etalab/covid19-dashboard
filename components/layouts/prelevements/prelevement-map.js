import React, {useState, useContext, useEffect, useRef, useCallback} from 'react'
import ReactMapGL, {Source, Layer, Popup, Marker, WebMercatorViewport} from 'react-map-gl'
import nearestPoint from '@turf/nearest-point'
import bbox from '@turf/bbox'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import PlaceSumup from './place-sumup'
import {PrelevementsContext} from '.'

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
  const {prelevementsSites, address, selectedPlace, hoveredPlace, setPlaces, setSelectedPlace, setHoveredPlace} = useContext(PrelevementsContext)

  const defaultViewport = {
    latitude: 46.9,
    longitude: 1.7,
    zoom: isMobileDevice ? 4 : 5
  }

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

    if (feature) {
      const place = prelevementsSites.features.find(({properties}) => properties.id === feature.properties.id)
      setHoveredPlace(place.properties)
      setHovered({
        longitude,
        latitude,
        feature
      })
    } else {
      setHovered(null)
      setHoveredPlace(null)
    }
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

  const fitBounds = (a, b) => {
    const bounds = bbox({type: 'FeatureCollection', features: [a, b]}).map(n => Number(n))
    setViewport(viewport => {
      return new WebMercatorViewport(viewport)
        .fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], {padding: 100})
    })
  }

  const getVisiblePlaces = useCallback(() => {
    if (mapRef && mapRef.current) {
      const features = mapRef.current.queryRenderedFeatures(null, {layers: ['public-place', 'limited-access']})
      const visiblePlaces = features.map(f => f.properties.id)
      return prelevementsSites.features.filter(({properties}) => visiblePlaces.includes(properties.id)).map(({properties}) => properties)
    }

    return []
  }, [mapRef, prelevementsSites])

  useEffect(() => {
    if (selectedPlace) {
      const {longitude, latitude} = selectedPlace
      if (address) {
        const selectedPlaceFeature = {
          type: 'Feature',
          properties: selectedPlace,
          geometry: {
            type: 'Point',
            coordinates: [
              longitude,
              latitude
            ]
          }
        }
        fitBounds(address, selectedPlaceFeature)
      } else {
        setViewport(viewport => {
          return {
            ...viewport,
            longitude: Number(longitude),
            latitude: Number(latitude),
            zoom: 15
          }
        })
      }
    }
  }, [address, selectedPlace])

  useEffect(() => {
    if (address) {
      const {type, population} = address.properties
      if (type === 'housenumber' || type === 'street' || population < 10000) {
        const nearest = nearestPoint(address, prelevementsSites)
        fitBounds(address, nearest)
      } else {
        const [longitude, latitude] = address.geometry.coordinates
        setViewport(viewport => {
          return {
            ...viewport,
            longitude,
            latitude,
            zoom: zoomLevel[type]
          }
        })
      }
    }
  }, [address, prelevementsSites, getVisiblePlaces, setPlaces])

  useEffect(() => {
    if (viewport.zoom >= 9) {
      const places = getVisiblePlaces()
      setPlaces(places)
    }
  }, [address, viewport, setPlaces, prelevementsSites, getVisiblePlaces])

  const addressLayer = {
    type: 'symbol',
    paint: {
      'text-halo-color': '#fff',
      'text-halo-width': 4
    },
    layout: {
      'text-field': '{name}',
      'text-size': 16,
      'text-offset': [0, -3],
      'text-anchor': 'top'
    }
  }

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
        <Layer id='place-name' {...addressLayer} filter={['==', ['get', 'id'], selectedPlaceId]} />
      </Source>

      {address && (
        <>
          <Source type='geojson' data={address}>
            <Layer id='address-name' {...addressLayer} />
          </Source>

          <Marker
            latitude={address.geometry.coordinates[1]}
            longitude={address.geometry.coordinates[0]}
            offsetLeft={-20}
            offsetTop={-20}
          >
            <img src='./icons/Map_pin_icon.svg' width='20' />
          </Marker>
        </>
      )}

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

      <style jsx>{`
        .marker {
          text-align: center;
        }
        `}</style>
    </ReactMapGL>
  )
}

export default PrelevementsMap
