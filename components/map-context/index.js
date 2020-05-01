import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Popup, Source, Layer} from 'react-map-gl'

import {AppContext} from '../../pages'
import {getReport, reportToGeoJSON} from '../../lib/data'

import Map from './map'
import SumUp from './sumup'

const MapContext = ({code, map, hidePopup, hideAttribution}) => {
  const {date, forcedDate, isMobileDevice} = useContext(AppContext)

  const [hovered, setHovered] = useState(null)
  const [layerData, setLayerData] = useState(null)

  const {layers} = map

  const selectedDate = forcedDate || date

  useEffect(() => {
    async function prepareLayerData() {
      const report = await getReport(selectedDate, code === 'FRA' ? 'REG' : 'DEP')
      setLayerData(reportToGeoJSON(report, selectedDate))
    }

    prepareLayerData()
  }, [selectedDate, code])

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
    let location
    let as = '/'

    if (feature) {
      const [typeTerritoire, codeTerritoire] = feature.properties.code.split('-')
      location = feature.properties.code
      as = `/${typeTerritoire === 'REG' ? 'regions' : 'departements'}/${codeTerritoire}`
    }

    Router.push({
      pathname: '/',
      query: {
        ...Router.query,
        location
      }
    }, as)

    setHovered(null)
  }

  return (
    <div className='map-container'>
      <Map
        code={code}
        interactiveLayerIds={layers.map(l => l.id)}
        hideAttribution={hideAttribution}
        onHover={isMobileDevice ? null : onHover}
        onClick={onClick}
      >
        {layerData &&
          <Source
            type='geojson'
            attribution='Données Santé publique France'
            data={layerData}
          >
            {layers.map(layer => (
              <Layer key={layer.id} {...layer} />
            ))}
          </Source>}

        {hovered && !hidePopup && (
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
  hideAttribution: false
}

MapContext.propTypes = {
  code: PropTypes.string.isRequired,
  map: PropTypes.object.isRequired,
  hidePopup: PropTypes.bool,
  hideAttribution: PropTypes.bool
}

export default MapContext
