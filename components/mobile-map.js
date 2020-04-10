import React, {useContext, useState} from 'react'

import {AppContext, ThemeContext} from '../pages'

import MapSelector from './map-selector'
import ReactMapGL from './react-map-gl'
import Drom, {droms} from './react-map-gl/drom'
import Statistics from './statistics'

const MobileMap = () => {
  const themeContext = useContext(ThemeContext)
  const {selectedLocation, selectedMapIdx, setSelectedMapIdx} = useContext(AppContext)

  const [showDrom, setShowDrom] = useState(selectedLocation && droms.find(({code}) => selectedLocation === code))

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
            <ReactMapGL code={selectedLocation || 'FR'} />
          )}
        </div>
      </div>

      {selectedLocation && (
        <div className={`mobile-sumup ${selectedLocation ? 'show' : 'hide'}`}>
          {selectedLocation && (
            <div className='mobile-statistics'>
              <Statistics />
            </div>
          )}
        </div>
      )}

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

        .mobile-sumup {
          z-index: 2;
          display: flex;
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

        .mobile-statistics {
          position: relative;
          flex: 1;
          overflow: auto;
        }
      `}</style>
    </div>

  )
}

export default MobileMap
