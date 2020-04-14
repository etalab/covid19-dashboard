import React, {useContext, useState} from 'react'
import {ChevronUp, ChevronDown} from 'react-feather'

import {AppContext, ThemeContext} from '../pages'

import MapSelector from './map-selector'
import ReactMapGL from './react-map-gl'
import Drom, {droms} from './react-map-gl/drom'
import Statistics from './statistics'
import {getReport} from '../lib/data'

const SHOW_STATS_HEIGHT = 38

const MobileMap = () => {
  let report
  const themeContext = useContext(ThemeContext)
  const {date, selectedLocation, selectedMapIdx, setSelectedMapIdx} = useContext(AppContext)

  const [showStats, setShowStats] = useState(false)
  const [showDrom, setShowDrom] = useState(selectedLocation && droms.find(({code}) => selectedLocation === code))

  if (selectedLocation) {
    report = getReport(date, selectedLocation)
  }

  return (
    <div className='mobile-map-container'>
      <div className='map-switch clickable' onClick={() => setShowDrom(!showDrom)}>
      </div>
      <div className='map-selector clickable'>
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

      {selectedLocation && !showDrom && (
        <div className={`mobile-sumup ${showStats ? 'show' : 'hide'}`}>
          <div className='show-stats clickable' onClick={() => setShowStats(!showStats)}>
            Chiffres {report.nom} {showStats ? <ChevronDown /> : <ChevronUp />}
          </div>
          <div className='mobile-statistics'>
            <Statistics />
          </div>
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
          flex-direction: column;
          bottom: 0;
          background-color: #fff;
          width: 100%;
          height: 100%;
          margin: auto;
          transition: 0.5s;
        }

        .mobile-sumup.hide {
          height: ${SHOW_STATS_HEIGHT}px;
          padding: 0;
        }

        .mobile-sumup.show {
          height: 100%;
        }

        .show-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.4em;
          color: #fff;
          min-height: ${SHOW_STATS_HEIGHT}px;
          background-color: ${themeContext.primary};
        }

        .mobile-statistics {
          position: relative;
          flex: 1;
          overflow: auto;
        }

        .clickable:hover {
          cursor:
        }
      `}</style>
    </div>

  )
}

export default MobileMap
