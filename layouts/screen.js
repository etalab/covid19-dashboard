import React from 'react'

import DateNav from '../components/date-nav'
import Scrollable from '../components/scrollable'
import ReactMapGl from '../components/react-map-gl'
import Statistics from '../components/statistics'
import Informations from '../components/informations'

import colors from '../styles/colors'

import Drom from '../components/react-map-gl/drom'
import {franceMetropolitan} from '../components/react-map-gl/maps'

const STATIC_MAP_HEIGHT = 200

const ScreenPage = () => {
  return (
    <>
      <div className='menu'>
        <DateNav />
        <Scrollable>
          <>
            <Statistics />
            <Informations />
          </>
        </Scrollable>
      </div>

      <div className='map'>
        <div className='metropole'>
          <ReactMapGl {...franceMetropolitan} />
        </div>
        <div className='drom-container'>
          <Drom />
        </div>
      </div>

      <style jsx>{`
      .menu {
        z-index: 1;
        display: flex;
        flex-direction: column;
        max-width: 500px;
        box-shadow: 0 1px 4px ${colors.lightGrey};
      }

      .map {
        flex: 1;
        height: 100%;
      }

      .metropole {
        height: calc(100% - ${STATIC_MAP_HEIGHT}px);
      }

      .drom-container {
        padding: 0.5em;
        height: ${STATIC_MAP_HEIGHT}px;
      }

      @media (max-width: 1250px) {
        .metropole {
          height: calc(100% - (${STATIC_MAP_HEIGHT}px * 2));
        }

        .drom-container {
          height: ${STATIC_MAP_HEIGHT * 2}px;
        }
      }

      @media (max-width: 955px) {
        .drom-container {
          height: 50%;
        }
        .metropole {
          height: 50%;
        }
      }
    `}</style>
    </>
  )
}

export default ScreenPage
