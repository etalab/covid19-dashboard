import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {AppContext} from '../pages'

import MapContext from './map-context'
import Drom from './map-context/drom'
import MapSelector from './map-selector'

const TerritoriesDesktopMap = ({maps, disableMapSelector, context, disableClick}) => {
  const {selectedLocation} = useContext(AppContext)
  const {selectedMapId, setSelectedMapId, setSelectedStat} = useContext(context)

  const selectedMap = maps.find(m => m.name === selectedMapId)

  return (
    <>
      <div className='metropole'>
        {maps.length > 1 && !disableMapSelector && (
          <div className='map-selector'>
            <MapSelector selectedMapId={selectedMapId} maps={maps} selectMap={setSelectedMapId} selectStat={setSelectedStat} />
          </div>
        )}
        <MapContext code={selectedLocation} map={selectedMap} disableFitbound={selectedMap.disableFitbound} disableClick={disableClick} />
      </div>
      <div className='drom-container'>
        <Drom map={selectedMap} disableClick={disableClick} />
      </div>

      <style jsx>{`
        .metropole {
          flex: 1;
        }

        .drom-container {
          display: flex;
          padding: 0.5em;
          height: 25%;
        }

        .map-selector {
          z-index: 3;
          position: absolute;
          background-color: #000000aa;
          color: #fff;
          border-radius: 4px;
          margin: 0.5em;
          width: 240px;
        }

        @media (max-width: 1000px) {
          .drom-container {
            height: 40%;
          }
        }

        @media (max-width: 800px) {
          .drom-container {
            height: 50%;
          }
        }
      `}</style>
    </>
  )
}

TerritoriesDesktopMap.defaultProps = {
  disableClick: false,
  disableMapSelector: false
}

TerritoriesDesktopMap.propTypes = {
  maps: PropTypes.array.isRequired,
  context: PropTypes.object.isRequired,
  disableClick: PropTypes.bool,
  disableMapSelector: PropTypes.bool
}

export default TerritoriesDesktopMap
