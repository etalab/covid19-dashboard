import React, {useContext, useState, useEffect, useCallback} from 'react'
import {BarChart2} from 'react-feather'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import {getPreviousReport, getReport} from '../../../lib/data'

import Counters from './big-picture-counters'
import MixedChart from '../../charts/mixed-chart'
import IndicateurCumulChart from '../../charts/indicateur-cumul'
import IndicateurVariationChart from '../../charts/indicateur-variation'
import Button from '../../button'

import {BigPictureContext} from '.'

const charts = {
  mixed: {
    name: 'Tout afficher',
    chart: MixedChart
  },
  confirmed: {
    name: 'Cas confirmés',
    type: 'indicateur',
    options: {
      label: 'Cas confirmés',
      metricName: 'casConfirmes',
      color: 'orange'
    }
  },
  hospitalises: {
    name: 'Patients hospitalisés',
    type: 'indicateur',
    options: {
      label: 'Patients hospitalisés',
      metricName: 'hospitalises',
      color: 'darkGrey'
    }
  },
  nouvellesHospitalisations: {
    name: 'Nouveaux patients hospitalisés',
    type: 'indicateur',
    options: {
      label: 'Nouveaux patients hospitalisés',
      metricName: 'nouvellesHospitalisations',
      color: 'darkGrey'
    }
  },
  reanimation: {
    name: 'Patients en réanimation',
    type: 'indicateur',
    options: {
      label: 'Patients en réanimation',
      metricName: 'reanimation',
      color: 'darkerGrey'
    }
  },
  nouvellesReanimations: {
    name: 'Nouveaux patients en réanimation',
    type: 'indicateur',
    options: {
      label: 'Nouveaux patients en réanimation',
      metricName: 'nouvellesReanimations',
      color: 'darkerGrey'
    }
  },
  deces: {
    name: 'Décès à l’hôpital',
    type: 'indicateur',
    options: {
      label: 'Décès à l’hôpital',
      metricName: 'deces',
      color: 'red'
    }
  },
  gueris: {
    name: 'Retours à domicile',
    type: 'indicateur',
    options: {
      label: 'Retours à domicile',
      metricName: 'gueris',
      color: 'green'
    }
  },
  casConfirmesEhpad: {
    name: 'Cas confirmés',
    type: 'indicateur',
    options: {
      label: 'Cas confirmés',
      metricName: 'casConfirmesEhpad',
      color: 'darkOrange'
    }
  },
  decesEhpad: {
    name: 'Décès',
    type: 'indicateur',
    options: {
      label: 'Décès',
      metricName: 'decesEhpad',
      color: 'darkRed'
    }
  },
  cumulPremieresInjections: {
    name: 'Nombre de premières doses injectées',
    type: 'indicateur',
    options: {
      label: 'Nombre de premières doses injectées',
      metricName: 'cumulPremieresInjections',
      color: 'green'
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

const BigPictureStatistics = () => {
  const {date, selectedLocation, setSelectedLocation, isMobileDevice} = useContext(AppContext)

  const [report, setReport] = useState(null)
  const [previousReport, setPreviousReport] = useState(null)

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

  const {selectedStat, setSelectedStat} = useContext(BigPictureContext)
  const [showVariations, setShowVariations] = useState(false)
  const stat = selectedStat || 'mixed'

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

  return (
    <>
      <div className='header'>
        {selectedLocation && !isMobileDevice && (
          <div onClick={() => setSelectedLocation('FRA')} className='back'><BarChart2 /> <span>France</span></div>
        )}
        <h3>COVID-19 - {report ? report.nom : 'France'}</h3>
      </div>

      {report && (
        <Counters report={report} previousReport={previousReport} />
      )}
      {report && report.history && stat && (
        <>
          {isToggleable && <a className='toggle' onClick={() => setShowVariations(!showVariations)}>{showVariations ? 'Afficher les valeurs cumulées' : 'Afficher les variations quotidiennes'}</a>}
          <div className='chart-container'>
            <Chart reports={report.history.filter(r => date >= r.date)} {...selectedChartOptions} />
          </div>
          {stat !== 'mixed' &&
            <Button title='Afficher le cumul' onClick={() => setSelectedStat('mixed')} isMobileDevice={isMobileDevice} />}
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

        .chart-container {
          margin: ${isMobileDevice ? '0 0.2em' : '0 1em'};
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

export default BigPictureStatistics
