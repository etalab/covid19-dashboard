import React, {useContext} from 'react'
import {X, BarChart2} from 'react-feather'
import Link from 'next/link'

import colors from '../styles/colors'

import {AppContext} from '../pages'

import Counters from './counters'

const Statistics = () => {
  const {date, franceReport, previousFranceReport, selectedPreviousLocationReport, selectedLocationReport, isMobileDevice} = useContext(AppContext)

  const report = selectedLocationReport || franceReport
  const previousReport = selectedPreviousLocationReport || previousFranceReport

  return (
    <div className='stats'>
      <div className='header'>
        {selectedLocationReport && (
          isMobileDevice ? (
            <Link href='/'><div className='close'><X /></div></Link>
          ) : (
            <Link href='/'><div className='back'><BarChart2 /> <span>France</span></div></Link>
          )
        )}
        <h2>COVID-19 en {selectedLocationReport ? selectedLocationReport.nom : 'France'}</h2>
      </div>

      <Counters report={report} previousReport={previousReport} date={date} />

      <style jsx>{`
        .stats {
          width: 99%;
        }
        .header {
          text-align: center;
          position: sticky;
          top: 0;
          background-color: white;
          padding: 0.4em;
          box-shadow: 0 1px 4px ${colors.lightGrey};
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
          padding: .5em;
        }

        .back span {
          margin: 0 0.5em;
        }

        .back:hover {
          cursor: pointer;
          background: ${colors.lightGrey};
        }

        `}</style>
    </div>
  )
}

export default Statistics
