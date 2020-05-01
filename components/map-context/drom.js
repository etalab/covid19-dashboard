import React from 'react'
import PropTypes from 'prop-types'

import MapContext from '.'

export const droms = [
  {
    name: 'Guadeloupe',
    code: 'REG-01'
  },
  {
    name: 'Martinique',
    code: 'REG-02'
  },
  {
    name: 'Guyane',
    code: 'REG-03'
  },
  {
    name: 'La Réunion',
    code: 'REG-04'
  },
  {
    name: 'Mayotte',
    code: 'REG-06'
  }
]

const Drom = ({map, disableClick}) => {
  return (
    <div className='drom-grid'>

      {droms.map(({code, name}) => (
        <div key={code} className='drom'>
          <div className='drom-name'>{name}</div>
          <MapContext code={code} map={map} hidePopup hideAttribution disableClick={disableClick} />
        </div>
      ))}

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
