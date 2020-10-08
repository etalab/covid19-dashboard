import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import {ChevronDown, ChevronUp, Check} from 'react-feather'

import colors from '../styles/colors'

const MapSelector = ({selectedMapId, maps, selectMap, selectStat}) => {
  const selectedMap = maps.find(m => m.name === selectedMapId)

  const [isOpen, setIsOpen] = useState(false)

  const handleMap = useCallback(map => {
    const {name, property} = map
    selectStat(property)
    selectMap(name)
    setIsOpen(false)
  }, [selectMap, selectStat])

  const handleClick = useCallback(event => {
    event.stopPropagation()
    setIsOpen(!isOpen)
  }, [isOpen])

  return (
    <div className='switch'>
      <div className='header' onClick={handleClick}>
        <span>{selectedMap.name}</span> {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>
      {isOpen && (
        <div className='menu'>
          {maps.map(map => (
            <div
              key={map.name}
              className={`menu-item ${selectedMapId === map.name ? 'selected' : ''}`}
              onClick={() => handleMap(map)}
            >
              <span>{map.name}</span> {map.name === selectedMapId && <Check />}
            </div>
          ))}
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
  selectedMapId: PropTypes.string.isRequired,
  maps: PropTypes.array.isRequired,
  selectMap: PropTypes.func.isRequired,
  selectStat: PropTypes.func.isRequired
}

export default MapSelector
