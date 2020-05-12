import React, {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import {Marker, Popup, Source, Layer} from 'react-map-gl'
import {MapPin, ArrowLeft} from 'react-feather'

import {ThemeContext, AppContext} from '../../../pages'
import {MasksContext} from '.'
import MasksCommunePopup from './mask-commune-popup'

const Markers = ({data, onHover, onClick}) => {
  const themeContext = useContext(ThemeContext)

  const handleEvent = (event, data, cb) => {
    event.stopPropagation()

    if (cb) {
      cb(data)
    }
  }

  return data
    .filter(({centre, nom}) => nom === 'international' || Boolean(centre))
    .map(commune => {
      const {nom, centre: {coordinates: [longitude, latitude]}} = commune
      return (
        <Marker key={nom} longitude={longitude} latitude={latitude}>
          <div
            onMouseEnter={event => handleEvent(event, commune, onHover)}
            onMouseLeave={event => handleEvent(event, null, onHover)}
            onClick={event => handleEvent(event, commune, onClick)}
          >
            <MapPin color={themeContext.secondary} />
          </div>
        </Marker>
      )
    })
}

export const MasksMap = ({hovered, isDROM}) => {
  const themeContext = useContext(ThemeContext)
  const {isMobileDevice, selectedLocation, setSelectedLocation} = useContext(AppContext)
  const {masksCommunes, setSelectedCommune} = useContext(MasksContext)

  const hoveredRegion = hovered ? hovered.feature.properties.code : ''
  const [hoveredMarker, setHoveredMarker] = useState()

  const selectedRegion = selectedLocation.includes('REG') ? selectedLocation.split('-')[1] : null

  const regionsFillLayer = {
    id: 'regions-fill',
    'source-layer': 'regions',
    type: 'fill',
    filter: ['!=', ['get', 'code'], selectedRegion],
    paint: {
      'fill-color': [
        'case',
        ['==', ['get', 'code'], hoveredRegion],
        'rgba(0, 65, 146, 0.5)',
        'rgba(0, 65, 146, 0.1)'
      ],
      'fill-outline-color': themeContext.primary
    }
  }

  const reset = event => {
    event.stopPropagation()
    setSelectedLocation(null)
    setSelectedCommune(null)
    setHoveredMarker(null)
  }

  const onClick = commune => {
    setSelectedCommune(commune)
    setHoveredMarker(null)
  }

  const onHoverMarker = commune => {
    if (commune) {
      if (selectedRegion || commune.nom === 'international') {
        const {centre: {coordinates: [longitude, latitude]}} = commune
        setHoveredMarker({
          longitude,
          latitude,
          commune
        })
      }
    } else {
      setHoveredMarker(null)
    }
  }

  return (
    <>
      {!isDROM && selectedRegion && (
        <div className='back' onClick={reset}>
          <span><ArrowLeft /></span> Retour
        </div>
      )}

      <Source
        id='decoupage-administratif'
        type='vector'
        url='https://etalab-tiles.fr/data/decoupage-administratif.json'
      >
        <Layer {...regionsFillLayer} />
      </Source>

      {masksCommunes && (
        <Markers
          data={masksCommunes}
          onHover={isMobileDevice ? null : onHoverMarker}
          onClick={selectedRegion ? onClick : null}
        />
      )}

      {hoveredMarker && (
        <Popup
          longitude={hoveredMarker.longitude}
          latitude={hoveredMarker.latitude}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setHoveredMarker(null)}
          anchor='bottom-left'
        >
          <MasksCommunePopup {...hoveredMarker.commune} />
        </Popup>
      )}

      <style jsx>{`
        .map-container {
          display: flex;
          position: relative;
          width: 100%;
          height: 100%;
        }

        .back {
          position: absolute;
          display: flex;
          align-items: center;
          top: 0.5em;
          left: 0.5em;
          padding: 0.5em;
          background-color: #000000aa;
          color: #fff;
          border-radius: 4px;
        }

        .back:hover {
          cursor: pointer;
          background-color: #000;
        }

        .back span {
          display: flex;
          margin-right: 0.5em;
        }
      `}</style>
    </>
  )
}

MasksMap.defaultProps = {
  hovered: null,
  isDROM: false
}

MasksMap.propTypes = {
  hovered: PropTypes.object,
  isDROM: PropTypes.bool
}

export const interactiveLayersIds = ['regions-fill']
