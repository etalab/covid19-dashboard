import React, {useState, useContext} from 'react'
import {FileText, Map, BarChart} from 'react-feather'

import colors from '../styles/colors'
import theme from '../styles/theme'

import {AppContext} from '../pages'

import DateNav from '../components/date-nav'
import Scrollable from '../components/scrollable'
import ReactMapGl from '../components/react-map-gl'
import NationalStatistics from '../components/national-statistics'
import Informations from '../components/informations'
import Footer from '../components/footer'

const VIEWS = {
  map: () => <ReactMapGl />,
  stats: () => <NationalStatistics />,
  informations: () => <Informations />
}

const MobilePage = () => {
  const [selectedView, setSelectedView] = useState('map')

  const app = useContext(AppContext)

  return (
    <div className='mobile-page-container'>
      <DateNav />
      <Scrollable>
        {VIEWS[selectedView](app)}
      </Scrollable>

      <div className='view-selector'>
        <div className={`${selectedView === 'informations' ? 'selected' : ''}`} onClick={() => setSelectedView('informations')}>
          <FileText />
        </div>
        <div className={`${selectedView === 'map' ? 'selected' : ''}`} onClick={() => setSelectedView('map')}>
          <Map />
        </div>
        <div className={`${selectedView === 'stats' ? 'selected' : ''}`} onClick={() => setSelectedView('stats')}>
          <BarChart />
        </div>
      </div>

      {!app.isIframe && <Footer />}

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
