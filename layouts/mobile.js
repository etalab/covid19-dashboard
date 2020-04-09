import React, {useState, useContext} from 'react'
import {FileText, Map, BarChart2} from 'react-feather'

import colors from '../styles/colors'

import {AppContext, ThemeContext} from '../pages'

import DateNav from '../components/date-nav'
import Scrollable from '../components/scrollable'
import Statistics from '../components/statistics'
import Informations from '../components/informations'
import MobileMap from '../components/mobile-map'

const VIEWS = {
  map: <MobileMap />,
  stats: (
    <Scrollable>
      <Statistics />
    </Scrollable>
  ),
  informations: (
    <Scrollable>
      <Informations />
    </Scrollable>
  )
}

const MobilePage = () => {
  const [selectedView, setSelectedView] = useState('stats')

  const app = useContext(AppContext)
  const theme = useContext(ThemeContext)

  const handleClick = view => {
    app.setSelectedLocation(null)
    setSelectedView(view)
  }

  return (
    <div className='mobile-page-container'>
      <DateNav disabled={selectedView === 'informations'} />
      {VIEWS[selectedView]}

      <div className='view-selector'>
        <div className={`${selectedView === 'stats' ? 'selected' : ''}`} onClick={() => handleClick('stats')}>
          <BarChart2 size={32} color={selectedView === 'stats' ? theme.primary : colors.black} />
        </div>
        <div className={`${selectedView === 'map' ? 'selected' : ''}`} onClick={() => handleClick('map')}>
          <Map size={32} color={selectedView === 'map' ? theme.primary : colors.black} />
        </div>
        <div className={`${selectedView === 'informations' ? 'selected' : ''}`} onClick={() => handleClick('informations')}>
          <FileText size={32} color={selectedView === 'informations' ? theme.primary : colors.black} />
        </div>
      </div>

      <style jsx>{`
        .mobile-page-container {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .view-selector {
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          box-shadow: 0 -1px 4px ${colors.lightGrey};
        }

        .view-selector > div {
          padding: 0.5em;
          margin: auto;
          margin-bottom: -4px;
        }

        .view-selector > div.selected {
          border-top: 4px solid ${theme.primary};
        }
      `}</style>
    </div>
  )
}

export default MobilePage
