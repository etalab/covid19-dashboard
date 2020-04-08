import React, {useContext} from 'react'

import {AppContext} from '../pages'

import DateNav from '../components/date-nav'
import LayoutSelector from '../components/layout-selector'

const MobilePage = () => {
  const {selectedLayout} = useContext(AppContext)

  return (
    <div className='mobile-page-container'>
      <div className='mobile-header'>
        <DateNav />
        <LayoutSelector />
      </div>

      {selectedLayout.component}

      <style jsx>{`
        .mobile-page-container {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .mobile-header {
          z-index: 3;
        }
      `}</style>
    </div>
  )
}

export default MobilePage
