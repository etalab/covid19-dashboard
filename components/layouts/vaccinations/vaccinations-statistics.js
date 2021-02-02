import React, {useState, useMemo, useEffect, useContext} from 'react'
import {keyBy} from 'lodash'
import {BarChart2} from 'react-feather'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import {getPreviousReport, getReport} from '../../../lib/data'

import IndicateurCumulChart from '../../charts/indicateur-cumul'
import IndicateurVariationChart from '../../charts/indicateur-variation'
import PieChartPercent from '../../pie-chart-percent'

import VaccinationsCounters from './vaccinations-counters'

import {VaccinationsContext} from '.'
import indicateurs from './indicateurs'

const charts = keyBy(indicateurs.map(indicateur => ({
  type: 'indicateur',
  options: {
    label: indicateur.label,
    metricName: indicateur.name,
    color: indicateur.color
  }
})), i => i.options.metricName)

const VaccinationsStatistics = () => {
  const {date, selectedLocation, setSelectedLocation, isMobileDevice} = useContext(AppContext)
  const {selectedStat} = useContext(VaccinationsContext)

  const [report, setReport] = useState(null)
  const [previousReport, setPreviousReport] = useState(null)
  const [showVariations, setShowVariations] = useState(false)

  const Chart = useMemo(() => {
    const chart = charts[selectedStat]
    if (chart) {
      if (chart.type === 'indicateur') {
        return showVariations ? IndicateurVariationChart : IndicateurCumulChart
      }
    }
  }, [selectedStat, showVariations])

  const isToggleable = useMemo(() => {
    if (Chart) {
      return charts[selectedStat].type === 'indicateur'
    }

    return false
  }, [Chart, selectedStat])

  const selectedChartOptions = useMemo(() => {
    if (Chart) {
      return charts[selectedStat].options || {}
    }
  }, [Chart, selectedStat])

  useEffect(() => {
    async function fetchReport() {
      setReport(await getReport(date, selectedLocation))
    }

    fetchReport()
  }, [date, selectedLocation])

  useEffect(() => {
    async function fetchPreviousReport() {
      setPreviousReport(await getPreviousReport(report))
    }

    if (report) {
      fetchPreviousReport()
    }
  }, [report])

  return (
    <>
      <div className='header'>
        {selectedLocation && !isMobileDevice && (
          <div onClick={() => setSelectedLocation('FRA')} className='back'><BarChart2 /> <span>France</span></div>
        )}
        <h3>COVID-19 - {report ? report.nom : 'France'}</h3>
      </div>

      {report && (
        <VaccinationsCounters report={report} previousReport={previousReport} />
      )}

      {report && report.prisesRendezVousSemaineRang1 && report.prisesRendezVousSemaineRang2 && (
        <PieChartPercent
          data={[report.prisesRendezVousSemaineRang1, report.prisesRendezVousSemaineRang2]}
          labels={['rendez-vous prévus cette semaine (première injection)', 'rendez-vous prévus cette semaine (seconde injection)']}
          colors={[colors.blueSoft, colors.purple]}
          height={isMobileDevice ? 150 : 130}
        />
      )}

      {report && report.history && selectedStat && Chart && (
        <>
          {isToggleable && <a className='toggle' onClick={() => setShowVariations(!showVariations)}>{showVariations ? 'Afficher les valeurs cumulées' : 'Afficher les variations quotidiennes'}</a>}
          <div className='chart-container'>
            <Chart reports={report.history.filter(r => date >= r.date)} {...selectedChartOptions} />
          </div>
        </>
      )}

      <style jsx>{`
        .header {
          z-index: 2;
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
        `}</style>
    </>
  )
}

export default VaccinationsStatistics
