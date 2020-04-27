import React, {useContext, useState} from 'react'
import {ChevronUp, ChevronDown} from 'react-feather'

import {ThemeContext} from '../../../pages'

import {MasksContext} from '.'

import MasksMap from './masks-map'
import MasksStatistics from './masks-statistics'

const SHOW_STATS_HEIGHT = 38

const MasksMobileMap = () => {
  const themeContext = useContext(ThemeContext)
  const {selectedCommune} = useContext(MasksContext)

  const [showStats, setShowStats] = useState(false)

  return (
    <div className='mobile-map-container'>
      <div className='map-content'>
        <MasksMap />
      </div>

      {selectedCommune && (
        <div className={`mobile-sumup ${showStats ? 'show' : 'hide'}`}>
          <div className='show-stats clickable' onClick={() => setShowStats(!showStats)}>
            Chiffres {selectedCommune.nom} {showStats ? <ChevronDown /> : <ChevronUp />}
          </div>
          <div className='mobile-statistics'>
            <MasksStatistics />
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

export default MasksMobileMap
