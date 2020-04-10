import React from 'react'

import ReactMapGL from '.'

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

const Drom = () => {
  return (
    <div className='drom-grid'>

      {droms.map(({code, name}) => (
        <div key={code} className='drom'>
          <div className='drom-name'>{name}</div>
          <ReactMapGL code={code} hidePopup hideAttribution />
        </div>
      ))}

      <style jsx>{`
          .drom-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            grid-gap: 0.5em;
            align-items: center;
            width: 100%;
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

export default Drom
