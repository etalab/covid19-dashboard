import React, {useContext} from 'react'

import {AppContext} from '../pages'

import DateNav from '../components/date-nav'
import LayoutSelector from '../components/layout-selector'
import DateWarning from '../components/date-warning'

const MobilePage = () => {
  const {selectedLayout, forcedDate} = useContext(AppContext)

  return (
    <div className='mobile-page-container'>
      <div className='mobile-header'>
        <DateNav />
        <LayoutSelector />
      </div>

      {forcedDate && <DateWarning date={forcedDate} />}

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
