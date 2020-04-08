import React, {useContext, useState} from 'react'

import {AppContext, ThemeContext} from '../pages'

import {franceMetropolitan, droms} from '../components/react-map-gl/maps'

import MapSelector from './map-selector'
import ReactMapGL from './react-map-gl'
import Drom from './react-map-gl/drom'

const MobileMap = () => {
  const themeContext = useContext(ThemeContext)
  const {selectedLocationReport, selectedMapIdx, setSelectedMapIdx} = useContext(AppContext)

  const [showDrom, setShowDrom] = useState(selectedLocationReport && droms.find(({code}) => selectedLocationReport.code === code))

  return (
    <div className='mobile-map-container'>
      <div className='map-switch' onClick={() => setShowDrom(!showDrom)}>
        {showDrom ? 'Voir la France métropolitaine' : 'Voir les DROM'}
      </div>
      <div className='map-selector'>
        <MapSelector mapIdx={selectedMapIdx} selectMap={setSelectedMapIdx} />
      </div>
      <div className='map-content'>
        <div>
          {showDrom ? (
            <Drom />
          ) : (
            <ReactMapGL {...franceMetropolitan} zoom={franceMetropolitan.mobileZoom} />
          )}
        </div>
      </div>

      <style jsx>{`
        .mobile-map-container {
          z-index: 2;
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .map-switch {
          padding: 0.5em;
          text-align: center;
          color: #FFF;
          background-color: ${themeContext.primary};
        }

        .map-selector {
          z-index: 2;
          background-color: #00000099;
          color: #fff;
        }

        .map-content,
        .map-content div {
          z-index: 1;
          display: flex;
          flex: 1;
        }
        `}</style>
    </div>

  )
}

export default MobileMap
