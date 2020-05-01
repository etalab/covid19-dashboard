import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {AppContext} from '../pages'

import ReactMapGl from './react-map-gl'
import Drom from './react-map-gl/drom'
import MapSelector from './map-selector'

const TerritoriesDesktopMap = ({maps, context}) => {
  const {selectedLocation} = useContext(AppContext)
  const {selectedMapIdx, setSelectedMapIdx} = useContext(context)

  const {layers} = maps[selectedMapIdx]

  return (
    <>
      <div className='metropole'>
        <div className='map-selector'>
          <MapSelector mapIdx={selectedMapIdx} maps={maps} selectMap={setSelectedMapIdx} />
        </div>
        <ReactMapGl code={selectedLocation || 'FRA'} layers={layers} />
      </div>
      <div className='drom-container'>
        <Drom layers={layers} />
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
