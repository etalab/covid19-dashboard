import React from 'react'

import {droms} from './maps'

import ReactMapGL from '.'

const Drom = () => {
  return (
    <div className='drom-grid'>

      {droms.map(({code, name}) => (
        <div key={code} className='drom'>
          <div className='drom-name'>{name}</div>
          <ReactMapGL code={code} hidePopup />
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
