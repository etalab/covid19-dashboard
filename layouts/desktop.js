import React, {useContext} from 'react'

import {AppContext, ThemeContext} from '../pages'

import colors from '../styles/colors'

import DateNav from '../components/date-nav'
import LayoutSelector from '../components/layout-selector'
import DateWarning from '../components/date-warning'

const HEADER_HEIGHT = '50px'

const DesktopPage = () => {
  const {selectedLayout, forcedDate} = useContext(AppContext)
  const themeContext = useContext(ThemeContext)

  return (
    <div className='desktop-container'>
      <div className='desktop-header'>
        <DateNav />
        <LayoutSelector />
      </div>

      {forcedDate && <DateWarning date={forcedDate} />}

      <div className='desktop-content'>
        {selectedLayout.component}
      </div>

      <style jsx>{`
        .desktop-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .desktop-header {
          z-index: 10;
          display: flex;
          background-color: ${themeContext.primary};
          box-shadow: ${forcedDate ? '' : `0 1px 4px ${colors.lightGrey}`};
          width: 100%;
          height: ${HEADER_HEIGHT};
        }

        .desktop-content {
          display: flex;
          height: calc(100% - ${HEADER_HEIGHT});
        }
    `}</style>
    </div>
  )
}

export default DesktopPage
