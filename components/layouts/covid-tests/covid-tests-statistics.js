import React, {useContext, useEffect, useState} from 'react'
import {BarChart2} from 'react-feather'
import Link from 'next/link'
import {sumBy} from 'lodash'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import {getReport} from '../../../lib/data'

import CovidTestsHistogram from './covid-tests-histogram'
import CovidTestsAgeChart from './covid-tests-age-chart'
import CovidTestsCounters from './covid-tests-counters'
import PieChartPercent from '../../pie-chart-percent'

const CovidTestsStatistics = () => {
  const {date, forcedDate, selectedLocation, isMobileDevice} = useContext(AppContext)
  const selectedDate = date || forcedDate

  const [report, setReport] = useState(null)
  const [statistics, setStatistics] = useState(null)

  useEffect(() => {
    async function fetchReport() {
      const report = await getReport(selectedDate, selectedLocation)
      setReport(report)

      const filteredHistory = report.history.filter(r => selectedDate >= r.date)

      const testsPositifs = sumBy(filteredHistory, 'testsPositifs')
      const testsRealises = sumBy(filteredHistory, 'testsRealises')
      const testsNegatifs = testsRealises - testsPositifs

      const pieChartData = [testsNegatifs, testsPositifs]

      setStatistics({
        pieChartData,
        testsPositifs,
        testsRealises
      })
    }

    fetchReport()
  }, [selectedDate, selectedLocation])

  useEffect(() => {

  }, [report])

  const pieLabels = ['Tests négatifs', 'Tests positifs']
  const pieColors = [colors.grey, colors.red]

  return (
    <>
      <div className='header'>
        {selectedLocation && !isMobileDevice && (
          <Link href='/'><div className='back'><BarChart2 /> <span>France</span></div></Link>
        )}
        <h3>COVID-19 - {report ? report.nom : 'France'}</h3>
      </div>
      {statistics && <CovidTestsCounters testsPositifs={statistics.testsPositifs} testsRealises={statistics.testsRealises} />}
      {statistics && <PieChartPercent data={statistics.pieChartData} labels={pieLabels} colors={pieColors} height={isMobileDevice ? 150 : 130} />}
      {report && <CovidTestsHistogram reports={report.history.filter(r => selectedDate >= r.date)} />}
      {report && <CovidTestsAgeChart reports={report.history.filter(r => selectedDate >= r.date)} />}
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
