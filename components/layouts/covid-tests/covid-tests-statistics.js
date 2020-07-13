import React, {useContext, useEffect, useState, useCallback} from 'react'
import {BarChart2} from 'react-feather'
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

import {CovidTestsContext} from '.'
import Button from '../../button'

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
  if (chartName) {
    if (charts[chartName].chart) {
      return charts[chartName].chart
    }

    if (charts[chartName].type === 'indicateur') {
      return showVariations ? IndicateurVariationChart : IndicateurCumulChart
    }
  }
}

const CovidTestsStatistics = () => {
  const {date, forcedDate, selectedLocation, setSelectedLocation, isMobileDevice} = useContext(AppContext)
  const {selectedStat, setSelectedStat} = useContext(CovidTestsContext)
  const selectedDate = forcedDate || date
  const stat = selectedStat || 'mixed'

  const [report, setReport] = useState(null)
  const [statistics, setStatistics] = useState(null)
  const [showVariations, setShowVariations] = useState(false)

  const Chart = getChart(stat, showVariations)

  const toggleable = useCallback(chartName => {
    if (chartName) {
      return charts[stat].type === 'indicateur'
    }

    return false
  }, [stat])

  const chartOptions = useCallback(chartName => {
    if (chartName) {
      return charts[stat].options || {}
    }
  }, [stat])

  const isToggleable = toggleable(stat)
  const selectedChartOptions = chartOptions(stat)

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

  const pieLabels = ['Tests négatifs', 'Tests positifs']
  const pieColors = [colors.grey, colors.red]

  return (
    <>
      <div className='header'>
        {selectedLocation && !isMobileDevice && (
          <div className='back' onClick={() => setSelectedLocation('FRA')}><BarChart2 /> <span>France</span></div>
        )}
        <h3>COVID-19 - {report ? report.nom : 'France'}</h3>
      </div>
      {statistics && (
        <CovidTestsCounters testsPositifs={statistics.testsPositifs} testsRealises={statistics.testsRealises} />
      )}
      {statistics && <PieChartPercent data={statistics.pieChartData} labels={pieLabels} colors={pieColors} height={isMobileDevice ? 150 : 130} />}
      {report && report.history && stat && (
        <>
          {isToggleable && <a className='toggle' onClick={() => setShowVariations(!showVariations)}>{showVariations ? 'Afficher les valeurs cumulées' : 'Afficher les variations quotidiennes'}</a>}
          <div className='chart-container'>
            <Chart reports={report.history.filter(r => selectedDate >= r.date)} {...selectedChartOptions} />
          </div>
          {stat !== 'mixed' &&
            <Button title='Afficher le cumul' onClick={() => setSelectedStat('mixed')} isMobileDevice={isMobileDevice} />}
        </>
      )}
      {report && <CovidTestsAgeChart report={report} />}
      <style jsx>{`
        .header {
          text-align: center;
          position: sticky;
          top: 0;
          background-color: white;
          padding: ${isMobileDevice ? '0.2em' : 0};
          box-shadow: 0 1px 4px ${colors.lightGrey};
          z-index: 1;
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
