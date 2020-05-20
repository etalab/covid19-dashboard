import React, {useContext, useEffect, useState} from 'react'
import {BarChart2} from 'react-feather'
import Link from 'next/link'
import {sumBy} from 'lodash'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import {getReport} from '../../../lib/data'

import CovidTestsAgeChart from './covid-tests-age-chart'
import CovidTestsCounters from './covid-tests-counters'
import PieChartPercent from '../../pie-chart-percent'
import IndicateurCumulChart from '../../charts/indicateur-cumul'
import IndicateurVariationChart from '../../charts/indicateur-variation'
import CovidTestsMixedChart from '../../charts/covid-tests-mixed-chart'

export const CovidTestsChartContext = React.createContext()

const charts = {
  mixed: {
    name: 'Tout afficher',
    chart: CovidTestsMixedChart
  },
  testsRealises: {
    name: 'Tests réalisés',
    type: 'indicateur',
    options: {
      label: 'Tests réalisés',
      metricName: 'testsRealises',
      color: 'darkGrey'
    }
  },
  testsPositifs: {
    name: 'Tests positifs',
    type: 'indicateur',
    options: {
      label: 'Tests positifs',
      metricName: 'testsPositifs',
      color: 'red'
    }
  }
}

function getChart(chartName, showVariations) {
  if (charts[chartName].chart) {
    return charts[chartName].chart
  }

  if (charts[chartName].type === 'indicateur') {
    return showVariations ? IndicateurVariationChart : IndicateurCumulChart
  }
}

const CovidTestsStatistics = () => {
  const {date, forcedDate, selectedLocation, isMobileDevice} = useContext(AppContext)
  const selectedDate = date || forcedDate

  const [report, setReport] = useState(null)
  const [statistics, setStatistics] = useState(null)
  const [selectedChart, setSelectedChart] = useState('mixed')
  const [showVariations, setShowVariations] = useState(false)

  const toggleable = charts[selectedChart].type === 'indicateur'

  const Chart = getChart(selectedChart, showVariations)
  const chartOptions = charts[selectedChart].options || {}

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
      {statistics && (
        <CovidTestsChartContext.Provider value={{selectedChart, setSelectedChart}}>
          <CovidTestsCounters testsPositifs={statistics.testsPositifs} testsRealises={statistics.testsRealises} />
        </CovidTestsChartContext.Provider>
      )}
      {statistics && <PieChartPercent data={statistics.pieChartData} labels={pieLabels} colors={pieColors} height={isMobileDevice ? 150 : 130} />}
      {report && report.history && (
        <>
          {toggleable && <a className='toggle' onClick={() => setShowVariations(!showVariations)}>{showVariations ? 'Afficher les valeurs cumulées' : 'Afficher les variations quotidiennes'}</a>}
          <div className='chart-container'>
            <Chart reports={report.history.filter(r => selectedDate >= r.date)} {...chartOptions} />
          </div>
        </>
      )}
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

        .back span {
          margin: 0 0.5em;
        }

        .back:hover {
          cursor: pointer;
          background: ${colors.lightGrey};
        }

        .toggle {
          padding: 2px 20px;
          text-align: right;
          font-size: 0.8em;
          cursor: pointer;
        }

        .chart-container {
          margin: ${isMobileDevice ? '0 0.2em' : '0 1em'};
        }
        `}</style>
    </>
  )
}

export default CovidTestsStatistics
