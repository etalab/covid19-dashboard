import React, {useContext} from 'react'

import {AppContext} from '../pages'

import DateNav from '../components/date-nav'
import Scrollable from '../components/scrollable'
import ReactMapGl from '../components/react-map-gl'
import NationalStatistics from '../components/national-statistics'
import Informations from '../components/informations'
import Footer from '../components/footer'

import colors from '../styles/colors'

const ScreenPage = () => {
  const {isIframe} = useContext(AppContext)
  return (
    <>
      <div className='menu'>
        <DateNav />
        <Scrollable>
          <>
            <NationalStatistics />
            <Informations />
          </>
        </Scrollable>
        {!isIframe && <Footer />}
      </div>

      <div className='map'>
        <ReactMapGl />
      </div>

      <style jsx>{`
      .menu {
        z-index: 1;
        display: flex;
        flex-direction: column;
        max-width: 400px;
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
