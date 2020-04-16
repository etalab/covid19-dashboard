import React, {useContext} from 'react'

import {TransfertContext} from './layouts/transfert'

import TransfertMap from './react-map-gl/transfert-map'
import TransfertsList from './transferts-list'
import Scrollable from './scrollable'

const TransfertMobileMap = () => {
  const {selectedTransferts} = useContext(TransfertContext)

  return (
    <div className='mobile-map-container'>
      <TransfertMap />
      <div className={`mobile-popup ${selectedTransferts ? 'show' : 'hide'}`}>
        <Scrollable>
          <TransfertsList />
        </Scrollable>
      </div>

      <style jsx>{`
        .mobile-map-container {
          display: flex;
          flex: 1;
          position: relative;
        }

        .mobile-popup {
          z-index: 2;
          display: flex;
          position: absolute;
          flex-direction: column;
          bottom: 0;
          background-color: #fff;
          width: 100%;
          height: 0;
          margin: auto;
          transition: 0.5s;
        }

        .mobile-popup.hide {
          padding: 0;
        }

        .mobile-popup.show {
          height: 100%;
        }
        `}</style>
    </div>
  )
}

export default TransfertMobileMap
