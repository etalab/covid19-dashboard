import React, {useState, useContext} from 'react'
import {FileText, Map, BarChart2} from 'react-feather'

import colors from '../styles/colors'
import theme from '../styles/theme'

import {AppContext} from '../pages'

import DateNav from '../components/date-nav'
import Scrollable from '../components/scrollable'
import ReactMapGl from '../components/react-map-gl'
import Statistics from '../components/statistics'
import Informations from '../components/informations'
import Footer from '../components/footer'

const DISABLE_FOOTER = process.env.DISABLE_FOOTER === '1'

const VIEWS = {
  map: () => <ReactMapGl />,
  stats: () => <Statistics />,
  informations: () => <Informations />
}

const MobilePage = () => {
  const [selectedView, setSelectedView] = useState('stats')

  const app = useContext(AppContext)

  const handleClick = view => {
    app.setSelectedLocation(null)
    setSelectedView(view)
  }

  return (
    <div className='mobile-page-container'>
      <DateNav disabled={selectedView === 'informations'} />
      <Scrollable>
        {VIEWS[selectedView]()}
      </Scrollable>

      <div className='view-selector'>
        <div className={`${selectedView === 'stats' ? 'selected' : ''}`} onClick={() => handleClick('stats')}>
          <BarChart2 />
        </div>
        <div className={`${selectedView === 'map' ? 'selected' : ''}`} onClick={() => handleClick('map')}>
          <Map />
        </div>
        <div className={`${selectedView === 'informations' ? 'selected' : ''}`} onClick={() => handleClick('informations')}>
          <FileText />
        </div>
      </div>

      {!app.isIframe && !DISABLE_FOOTER && <Footer />}

      <style jsx>{`
        .mobile-page-container {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .view-selector {
          display: none;
        }

        .view-selector > div {
          padding: 0.5em;
          margin: auto;
        }

        .view-selector > div.selected {
          border-top: 2px solid ${colors.blue};
        }

        @media (max-width: ${theme.mobileDisplay}) {
          .view-selector {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            justify-content: center;
            align-items: center;
            background-color: #fff;
          }
        }
      `}</style>
    </div>
  )
}

export default MobilePage
