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
    <>
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
        }

        .back span {
          margin: 0 0.5em;
        }

        .back:hover {
          cursor: pointer;
          background: ${colors.lightGrey};
        }

        .chart-container {
          margin: ${isMobileDevice ? '0 0.2em' : '0 1em'};
        }

        .charts-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          grid-gap: 0.2em;
          margin: 0.5em;
          background: #FFF;
        }

        .chart-name {
          display: block;
          font-weight: bold;
          height: 100%;
          text-align: center;
          background-color: ${colors.white};
          color: ${colors.darkBlue};
          padding: 0.4em;
          font-size: .7em;
          letter-spacing: .1em;
          border: 1px solid ${colors.darkBlue};
          text-transform: uppercase;
          transform: translate(-.1em, -.1em);
          transition: transform .1s ease-out;
        }

        .chart-name:hover {
          cursor: pointer;
          color: ${colors.white};
          background-color: ${colors.darkBlue};
          transform: translate(0px, 0px);
        }

        .chart-name.selected {
          color: #FFF;
          background-color: ${colors.darkBlue};
        }

        .button-container {
          background-color: ${colors.white};
          border-bottom: 1px solid ${colors.darkBlue};
          border-right: 1px solid ${colors.darkBlue};
          margin: .3em;
        }

        .button-container.selected {
          background-color: red;
        }
        `}</style>
    </>
  )
}

export default Statistics
