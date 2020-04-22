import React, {useContext} from 'react'
import {BarChart2} from 'react-feather'
import Link from 'next/link'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import {getReport} from '../../../lib/data'

import CovidTestsHistogram from './covid-tests-histogram'
import CovidTestsAgeChart from './covid-tests-age-chart'

const CovidTestsStatistics = () => {
  const {date, forcedDate, selectedLocation, isMobileDevice} = useContext(AppContext)

  const selectedDate = date || forcedDate
  const report = getReport(selectedDate, selectedLocation || 'FRA')

  return (
    <>
      <div className='header'>
        {selectedLocation && !isMobileDevice && (
          <Link href='/'><div className='back'><BarChart2 /> <span>France</span></div></Link>
        )}
        <h3>COVID-19 - {report ? report.nom : 'France'}</h3>
      </div>
      <CovidTestsHistogram reports={report.history.filter(r => date >= r.date)} />
      <CovidTestsAgeChart reports={report.history.filter(r => selectedDate >= r.date)} />
      <style jsx>{`
        .header {
          text-align: center;
          position: sticky;
          top: 0;
          background-color: white;
          padding: ${isMobileDevice ? '0.2em' : 0};
          box-shadow: 0 1px 4px ${colors.lightGrey};
        }

        .header h3 {
          margin: 0.4em;
        }

        .back {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background: ${colors.lighterGrey};
          padding: 0.5em;
          font-size: larger;
        }

        .close {
          position: absolute;
          top: 0;
          right: 0.5em;
        }

        .back span {
          margin: 0 0.5em;
        }

        .back:hover {
          cursor: pointer;
          background: ${colors.lightGrey};
        }
        `}</style>
    </>
  )
}

export default CovidTestsStatistics
