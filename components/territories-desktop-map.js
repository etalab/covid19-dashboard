import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {AppContext} from '../pages'

import MapContext from './map-context'
import Drom from './map-context/drom'
import MapSelector from './map-selector'

const TerritoriesDesktopMap = ({maps, context}) => {
  const {selectedLocation} = useContext(AppContext)
  const {selectedMapId, setSelectedMapId} = useContext(context)

  const selectedMap = maps.find(m => m.name === selectedMapId)

  return (
    <>
      <div className='metropole'>
        <div className='map-selector'>
          <MapSelector selectedMapId={selectedMapId} maps={maps} selectMap={setSelectedMapId} />
        </div>
        <MapContext code={selectedLocation} map={selectedMap} />
      </div>
      <div className='drom-container'>
        <Drom map={selectedMap} />
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

TerritoriesDesktopMap.propTypes = {
  maps: PropTypes.array.isRequired,
  context: PropTypes.object.isRequired
}

export default TerritoriesDesktopMap
