import React, {useState} from 'react'
import {FileText, Map, BarChart} from 'react-feather'

import colors from '../styles/colors'
import theme from '../styles/theme'

import DateNav from '../components/date-nav'
import Scrollable from '../components/scrollable'
import ReactMapGl from '../components/react-map-gl'
import Statistics from '../components/statistics'
import ConfirmedChart from '../components/confirmed-chart'
import Description from '../components/description'
import Footer from '../components/footer'

const VIEWS = {
  map: ({viewport, date, regionsReport, setViewport}) => (
    <ReactMapGl
      viewport={viewport}
      date={date}
      regions={regionsReport}
      onViewportChange={setViewport} />
  ),
  stats: ({date, franceReport}) => (
    <>
      <Statistics report={franceReport} />

      {franceReport && franceReport.history && (
        <ConfirmedChart data={franceReport.history.filter(r => date >= r.date)} height={300} />
      )}
    </>
  ),
  description: () => <Description />
}

const MobilePage = props => {
  const [selectedView, setSelectedView] = useState('map')

  return (
    <div className='mobile-page-container'>
      <DateNav {...props} />
      <Scrollable>
        {VIEWS[selectedView](props)}
      </Scrollable>

      <div className='view-selector'>
        <div className={`${selectedView === 'description' ? 'selected' : ''}`} onClick={() => setSelectedView('description')}>
          <FileText />
        </div>
        <div className={`${selectedView === 'map' ? 'selected' : ''}`} onClick={() => setSelectedView('map')}>
          <Map />
        </div>
        <div className={`${selectedView === 'stats' ? 'selected' : ''}`} onClick={() => setSelectedView('stats')}>
          <BarChart />
        </div>
      </div>

      <Footer />

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
