import React from 'react'

import DateNav from '../components/date-nav'
import Scrollable from '../components/scrollable'
import ReactMapGl from '../components/react-map-gl'
import Statistics from '../components/statistics'
import Informations from '../components/informations'

import colors from '../styles/colors'

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
        <ReactMapGl />
      </div>

      <style jsx>{`
      .menu {
        z-index: 1;
        display: flex;
        flex-direction: column;
        max-width: 700px;
        box-shadow: 0 1px 4px ${colors.lightGrey};
      }

      .map {
        flex: 1;
        height: 100%;
      }
    `}</style>
    </>
  )
}

export default ScreenPage
