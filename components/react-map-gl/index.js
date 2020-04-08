import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Popup} from 'react-map-gl'
import {Maximize2} from 'react-feather'

import {AppContext} from '../../pages'
import {getReport, reportToGeoJSON} from '../../lib/data'

import maps from '../maps'

import Map from './map'
import SumUp from './sumup'
import Statistics from '../statistics'

const SITE_URL = process.env.SITE_URL

const ReactMapGL = ({zoom, latitude, longitude}) => {
  const {
    date,
    selectedLocation,
    selectedMapIdx,
    isIframe,
    isMobileDevice
  } = useContext(AppContext)

  const report = getReport(date, selectedLocation)

  const [hovered, setHovered] = useState(null)

  const currentMap = maps[selectedMapIdx]
  const layerData = reportToGeoJSON(getReport(date, currentMap.granularity === 'regions' ? 'REG' : 'DEP'), date)

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
      const [typeTerritoire, codeTerritoire] = feature.properties.code.split('-')
      Router.push({
        pathname: '/',
        query: {
          location: feature.properties.code
        }
      }, `/${typeTerritoire === 'REG' ? 'regions' : 'departements'}/${codeTerritoire}`)
    } else {
      Router.push({
        pathname: '/'
      })
    }

    setHovered(null)
  }

  return (
    <div className='map-container'>
      <div className='controls'>

        {isIframe && (
          <div className='control maximize'>
            <a href={SITE_URL} target='_top'><Maximize2 style={{verticalAlign: 'middle'}} /></a>
          </div>
        )}
      </div>

      <Map
        zoom={zoom}
        latitude={latitude}
        longitude={longitude}
        data={layerData}
        layers={currentMap.layers}
        onHover={isMobileDevice ? null : onHover}
        onClick={onClick}
      >
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
      </Map>

      {isMobileDevice && (
        <div className={`mobile-sumup ${report ? 'show' : 'hide'}`}>
          {report && (
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

        .control {
          background-color: #000000aa;
          color: #fff;
          border-radius: 4px;
          margin: 0;
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

ReactMapGL.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired
}

export default ReactMapGL
