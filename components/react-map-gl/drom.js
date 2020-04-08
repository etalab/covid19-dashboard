import React from 'react'

import {droms} from './maps'

import ReactMapGL from '.'

const Drom = () => {
  return (
    <div className='drom-grid'>

      {droms.map(drom => (
        <ReactMapGL key={drom.code} {...drom} hidePopup />
      ))}

      <style jsx>{`
          .drom-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            grid-gap: 0.5em;
            align-items: center;
            flex: 1;
          }
        `}</style>
    </div>
  )
}

export default Drom
