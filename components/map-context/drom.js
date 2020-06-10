import React, {useCallback, useContext} from 'react'
import PropTypes from 'prop-types'

import geo from '../../geo.json'

import {AppContext} from '../../pages'

import MapContext from '.'

export const droms = [
  {
    name: 'Guadeloupe',
    code: 'DEP-971',
    region: '01'
  },
  {
    name: 'Martinique',
    code: 'DEP-972',
    region: '02'
  },
  {
    name: 'Guyane',
    code: 'DEP-973',
    region: '03'
  },
  {
    name: 'La Réunion',
    code: 'DEP-974',
    region: '04'
  },
  {
    name: 'Mayotte',
    code: 'DEP-976',
    region: '05'
  }
]

const getDROMCodeDep = nom => {
  let codeDep
  Object.keys(geo).filter(code => code.includes('DEP')).forEach(code => {
    if (geo[code].nom === nom) {
      codeDep = code.split('-')[1]
    }
  })

  return codeDep
}

const Drom = ({map, disableClick}) => {
  const {setSelectedLocation} = useContext(AppContext)

  const selectDROM = useCallback(code => {
    setSelectedLocation(code)
  }, [setSelectedLocation])

  return (
    <div className='drom-grid'>

      {droms.map(({code, name, region}) => {
        const codeDepartement = getDROMCodeDep(name)
        return (
          <div key={code} className='drom'>
            <div className='drom-name'>{name}</div>
            {map.hovered && (
              <div className='hovered' onClick={() => selectDROM(code)}>
                {map.hovered({properties: {code: codeDepartement, region}}, {allIndicators: false})}
              </div>
            )}
            <MapContext
              code={code}
              map={map}
              hidePopup
              hideAttribution
              isDROM
              disableClick={disableClick} />
          </div>
        )
      })}

      <style jsx>{`
          .drom-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            grid-gap: 0.5em;
            align-items: center;
            width: 100%;
            padding: 0.2em;
          }

          .drom {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
          }

          .drom-name {
            z-index: 1;
            position: absolute;
            top: 0;
            width: 100%;
            text-align: center;
            background-color: #ffffff99;
          }

          .hovered {
            visibility: hidden;
            z-index: 2;
            position: absolute;
            display: flex;
            height: 100%;
            width: 100%;
            padding: 1em;
            flex-flow: wrap;
            justify-content: center;
            align-items: center;
            text-align: center;
            background-color: #ffffffcc;
          }

          .drom:hover .hovered {
            visibility: visible;
            cursor: pointer;
          }
        `}</style>
    </div>
  )
}

Drom.defaultProps = {
  disableClick: false
}

Drom.propTypes = {
  map: PropTypes.object.isRequired,
  disableClick: PropTypes.bool
}

export default Drom
