import React, {useState} from 'react'

import DateNav from '../components/date-nav'
import Menu from '../components/menu'
import ReactMapGl from '../components/react-map-gl'
import Statistics from '../components/statistics'
import ConfirmedChart from '../components/confirmed-chart'
import Description from '../components/descritpion'

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
      <Menu selectedView={selectedView} selectView={setSelectedView}>
        {VIEWS[selectedView](props)}
      </Menu>

      <style jsx>{`
        .mobile-page-container {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
      `}</style>
    </div>
  )
}

export default MobilePage
