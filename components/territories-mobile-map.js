import React, {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronUp, ChevronDown} from 'react-feather'

import geo from '../geo.json'
import {AppContext, ThemeContext} from '../pages'

import MapSelector from './map-selector'
import MapContext from './map-context'
import Drom, {droms} from './map-context/drom'

const SHOW_STATS_HEIGHT = 38

const TerritoriesMobileMap = ({maps, context, children, disableClick}) => {
  const themeContext = useContext(ThemeContext)
  const {selectedLocation, setSelectedLocation} = useContext(AppContext)
  const {selectedMapId, setSelectedMapId, setSelectedStat} = useContext(context)

  const [showStats, setShowStats] = useState(false)
  const [showDrom, setShowDrom] = useState(selectedLocation && droms.find(({code}) => selectedLocation === code))

  const selectedMap = maps.find(m => m.name === selectedMapId)

  const onClick = () => {
    setShowDrom(!showDrom)

    if (showDrom) {
      setSelectedLocation('FRA')
    }
  }

  return (
    <div className='mobile-map-container'>
      <div className='map-switch clickable' onClick={() => onClick()}>
        Voir la France {showDrom ? 'métropolitaine' : 'd’outremer'}
      </div>
      {maps.length > 1 && (
        <div className='map-selector clickable'>
          <MapSelector selectedMapId={selectedMapId} maps={maps} selectMap={setSelectedMapId} selectStat={setSelectedStat} />
        </div>
      )}
      <div className='map-content'>
        <div>
          {showDrom ? (
            <Drom map={selectedMap} disableClick={disableClick} />
          ) : (
            <MapContext
              code={selectedLocation}
              map={selectedMap}
              disableClick={disableClick}
              disableFitbound={selectedMap.disableFitbound}
            />
          )}
        </div>
      </div>

      {children && selectedLocation && (
        <div className={`mobile-sumup ${showStats ? 'show' : 'hide'}`}>
          <div className='show-stats clickable' onClick={() => setShowStats(!showStats)}>
            {showStats ? 'Masquer' : 'Afficher'} les données {geo[selectedLocation].nom} {showStats ? <ChevronDown /> : <ChevronUp />}
          </div>
          <div className='mobile-statistics'>
            {children}
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

TerritoriesMobileMap.defaultProps = {
  context: null,
  disableClick: false
}

TerritoriesMobileMap.propTypes = {
  maps: PropTypes.array.isRequired,
  context: PropTypes.object,
  children: PropTypes.node.isRequired,
  disableClick: PropTypes.bool
}

export default TerritoriesMobileMap
