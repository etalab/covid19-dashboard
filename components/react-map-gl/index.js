import React, {useState, useCallback, useContext} from 'react'
import ReactMapGL, {NavigationControl, Source, Layer, Popup} from 'react-map-gl'
import {Maximize2} from 'react-feather'

import {AppContext} from '../../pages'

import MapSelector from '../map-selector'

import SumUp from './sumup'
import Statistics from '../statistics'

const SITE_URL = process.env.SITE_URL

const settings = {
  maxZoom: 10
}

const Map = () => {
  const {
    selectedLocationReport,
    setSelectedLocation,
    isIframe,
    viewport,
    maps,
    setViewport,
    isMobileDevice
  } = useContext(AppContext)

  const [map, setMap] = useState()
  const [hovered, setHovered] = useState(null)
  const [selectedMapIdx, setSelectedMapIdx] = useState(1)
  const [showZoomMessage, setShowZoomMessage] = useState(false)
  const [zoomMessageCoolDown, setZoomMessageCoolDown] = useState(true)

  const enableZoom = isIframe && isMobileDevice

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [])

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
      const {properties} = feature
      setSelectedLocation(properties.code)
    } else {
      setSelectedLocation(null)
    }

    setHovered(null)
  }

  const displayAlert = () => {
    if (!showZoomMessage && zoomMessageCoolDown) {
      setShowZoomMessage(true)
      setZoomMessageCoolDown(false)
      setTimeout(() => setShowZoomMessage(null), 5000)
      setTimeout(() => setZoomMessageCoolDown(true), 60000)
    }
  }

  return (
    <div className='map-container'>
      <div className='controls'>
        <div className='custom-control'>
          <MapSelector mapIdx={selectedMapIdx} selectMap={setSelectedMapIdx} />
        </div>

        {isIframe && (
          <div className='custom-control maximize'>
            <a href={SITE_URL} target='_top'><Maximize2 style={{verticalAlign: 'middle'}} /></a>
          </div>
        )}
      </div>

      {showZoomMessage && (
        <div className='zoom-message'>
          <p>Le zoom à la souris est désactivé.</p>
          <p>Merci d’utiliser les contrôles +/- situés en haut à droite.</p>
        </div>
      )}

      <ReactMapGL
        reuseMaps
        ref={mapRef}
        {...viewport}
        width='100%'
        height='100%'
        mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
        scrollZoom={enableZoom}
        {...settings}
        interactiveLayerIds={maps[selectedMapIdx].layers.map(layer => layer.id)}
        onViewportChange={setViewport}
        onHover={isMobileDevice ? null : onHover}
        onClick={onClick}
        onWheel={enableZoom ? null : displayAlert}
      >
        {!enableZoom && (
          <div className='control navigation'>
            <NavigationControl showCompass={false} />
          </div>
        )}

        <Source
          type='geojson'
          id='cas-confirmes'
          attribution='Données Santé publique France'
          data={maps[selectedMapIdx].data}
        >
          {maps[selectedMapIdx].layers.map(layer => (
            <Layer key={layer.id} {...layer} />
          ))}
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
            <SumUp nom={hovered.feature.properties.nom} />
          </Popup>
        )}
      </ReactMapGL>

      {isMobileDevice && (
        <div className={`mobile-sumup ${selectedLocationReport ? 'show' : 'hide'}`}>
          {selectedLocationReport && (
            <Statistics />
          )}
        </div>
      )}

      <style jsx>{`
        .map-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .controls {
          z-index: 1;
          position: absolute;
          display: flex;
          justify-content: space-between;
          align-items: start;
          width: 100%;
          padding: 0.5em;
        }

        .custom-control {
          background-color: #000000aa;
          color: #fff;
          border-radius: 4px;
          margin: 0;
        }

        .control {
          position: absolute;
          margin: 0.5em;
        }

        .navigation {
          top: 40px;
          right: 0;
        }

        .zoom-message {
          z-index: 999;
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background-color: #000000aa;
          color: #fff;
          padding: 30%;
          font-size: xx-large;
          text-align: center;
        }

        .maximize {
          display: flex;
          right: 0;
          border-radius: 4px;
          background: #53514f;
        }

        .maximize a {
          color: #fff;
          padding: 0.4em;
        }

        .mobile-sumup {
          z-index: 2;
          position: absolute;
          bottom: 0;
          background-color: #fff;
          width: 100%;
          margin: auto;
          padding: 0.5em;
          transition: 0.5s;
        }

        .mobile-sumup.hide {
          height: 0;
          padding: 0;
        }

        .mobile-sumup.show {
          height: 100%;
        }
      `}</style>
    </div>
  )
}

export default Map
