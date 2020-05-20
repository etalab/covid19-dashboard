import React, {useContext, useState, useEffect} from 'react'
import {BarChart2} from 'react-feather'
import Link from 'next/link'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import {getPreviousReport, getReport} from '../../../lib/data'

import Counters from './big-picture-counters'
import MixedChart from '../../charts/mixed-chart'
import IndicateurCumulChart from '../../charts/indicateur-cumul'
import IndicateurVariationChart from '../../charts/indicateur-variation'

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
    name: 'Hospitalisations',
    type: 'indicateur',
    options: {
      label: 'Hospitalisés',
      metricName: 'hospitalises',
      color: 'darkGrey'
    }
  },
  reanimation: {
    name: 'Réanimations',
    type: 'indicateur',
    options: {
      label: 'Réanimations',
      metricName: 'reanimation',
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
  casEhpad: {
    name: 'Cas total',
    type: 'indicateur',
    options: {
      label: 'Cas total',
      metricName: 'casEhpad',
      color: 'orange'
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

const BigPictureStatistics = () => {
  const {date, selectedLocation, isMobileDevice} = useContext(AppContext)

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

  const {selectedStat} = useContext(BigPictureContext)
  const [showVariations, setShowVariations] = useState(false)

  const toggleable = charts[selectedStat].type === 'indicateur'

  const Chart = getChart(selectedStat, showVariations)
  const chartOptions = charts[selectedStat].options || {}

  return (
    <>
      <div className='header'>
        {selectedLocation && !isMobileDevice && (
          <Link href='/'><div className='back'><BarChart2 /> <span>France</span></div></Link>
        )}
        <h3>COVID-19 - {report ? report.nom : 'France'}</h3>
      </div>

      {report && (
        <Counters report={report} previousReport={previousReport} />
      )}
      {report && report.history && (
        <>
          {toggleable && <a className='toggle' onClick={() => setShowVariations(!showVariations)}>{showVariations ? 'Afficher les valeurs cumulées' : 'Afficher les variations quotidiennes'}</a>}
          <div className='chart-container'>
            <Chart reports={report.history.filter(r => date >= r.date)} {...chartOptions} />
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
