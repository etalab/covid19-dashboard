import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import {indexOf} from 'lodash'
import {ChevronDown, ChevronUp, Check} from 'react-feather'

import colors from '../styles/colors'

const MapSelector = ({mapIdx, maps, selectMap}) => {
  const selectedMap = maps[mapIdx]

  const [isOpen, setIsOpen] = useState(false)

  const handleMap = useCallback(map => {
    selectMap(map)
    setIsOpen(false)
  }, [selectMap])

  return (
    <div className='switch'>
      <div className='header' onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedMap.name}</span> {isOpen ? <ChevronDown /> : <ChevronUp />}
      </div>
      {isOpen && (
        <div className='menu'>
          {maps.map(map => {
            const index = indexOf(maps, map)
            return (
              <div
                key={map.name}
                className={`menu-item ${index === mapIdx ? 'selected' : ''}`}
                onClick={() => handleMap(index)}
              >
                <span>{map.name}</span> {index === mapIdx && <Check />}
              </div>
            )
          })}
        </div>
      )}

      <style jsx>{`
        .switch {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5em;
        }

        .switch:hover {
          cursor: pointer;
        }

        .menu {
          position: absolute;
          display: flex;
          flex-direction: column;
          width: 100%;
          top: 100%;
          background-color: #000000aa;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 0.2em 0.5em;
        }

        .menu-item:hover {
          background-color: ${colors.lightGrey};
          color: #000;
        }

        .menu-item.selected:hover {
          background-color: transparent;
          cursor: initial;
        }

        span {
          margin-right: 0.4em;
        }
        `}</style>
    </div>
  )
}

MapSelector.propTypes = {
  mapIdx: PropTypes.number.isRequired,
  maps: PropTypes.array.isRequired,
  selectMap: PropTypes.func.isRequired
}

export default MapSelector
