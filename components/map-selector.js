import React, {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {indexOf, uniq} from 'lodash'
import {ChevronDown, ChevronUp, Check} from 'react-feather'

import colors from '../styles/colors'

import {AppContext} from '../pages'

const MapSelector = ({mapIdx, selectMap}) => {
  const {maps} = useContext(AppContext)
  const selectedMap = maps[mapIdx]

  const [isOpen, setIsOpen] = useState(false)

  const handleMap = useCallback(map => {
    selectMap(map)
    setIsOpen(false)
  }, [selectMap])

  const categories = uniq(maps.map(map => map.category))

  return (
    <div className='switch'>
      <div className='header' onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedMap.name} - maille {selectedMap.category}</span> {isOpen ? <ChevronDown /> : <ChevronUp />}
      </div>
      {isOpen && (
        <div className='menu'>
          {categories.map(cat => (
            <div key={cat} className='sub-cat'>
              <div className='sub-title'>{cat}</div>
              {maps.filter(({category}) => category === cat).map(map => {
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
          ))}
        </div>
      )}

      <style jsx>{`
        .switch {
          display: flex;
          flex-direction: column;
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
          display: flex;
          flex-direction: column;
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

        .sub-cat {
          padding-bottom: 0.2em;
        }

        .sub-title {
          font-size: larger;
          text-transform: capitalize;
          padding: 0.5em 0.4em;
          background-color: #00000066;
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
  selectMap: PropTypes.func.isRequired
}

export default MapSelector
