import React from 'react'

import DateNav from '../components/date-nav'
import Scrollable from '../components/scrollable'
import ReactMapGl from '../components/react-map-gl'
import Statistics from '../components/statistics'
import ConfirmedChart from '../components/confirmed-chart'
import Description from '../components/description'
import Footer from '../components/footer'

import colors from '../styles/colors'

const ScreenPage = ({date, franceReport, regionsReport, prev, next, viewport, setViewport}) => {
  return (
    <>
      <div className='menu'>
        <DateNav date={date} prev={prev} next={next} />
        <Scrollable date={date}>
          <>
            <Statistics report={franceReport} />

            {franceReport && franceReport.history && (
              <ConfirmedChart data={franceReport.history.filter(r => date >= r.date)} height={200} />
            )}

            <Description />
          </>
        </Scrollable>
        <Footer />
      </div>

      <div className='map'>
        <ReactMapGl
          viewport={viewport}
          date={date}
          regions={regionsReport}
          onViewportChange={setViewport}
        />
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
