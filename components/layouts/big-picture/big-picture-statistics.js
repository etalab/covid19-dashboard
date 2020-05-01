import React, {useContext, useState, useEffect} from 'react'
import {BarChart2} from 'react-feather'
import Link from 'next/link'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import {getPreviousReport, getReport} from '../../../lib/data'

import Counters from '../../counters'
import MixedChart from '../../charts/mixed-chart'
import IndicateurCumulChart from '../../charts/indicateur-cumul'
import IndicateurVariationChart from '../../charts/indicateur-variation'

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

  const [selectedChart, setSelectedChart] = useState('mixed')
  const [showVariations, setShowVariations] = useState(false)

  const toggleable = charts[selectedChart].type === 'indicateur'

  const Chart = getChart(selectedChart, showVariations)
  const chartOptions = charts[selectedChart].options || {}

  return (
    <>
      <div className='header'>
        {selectedLocation && !isMobileDevice && (
          <Link href='/'><div className='back'><BarChart2 /> <span>France</span></div></Link>
        )}
        <h3>COVID-19 - {report ? report.nom : 'France'}</h3>
      </div>

      {report && <Counters report={report} previousReport={previousReport} />}

      {report && report.history && (
        <>
          {toggleable && <a className='toggle' onClick={() => setShowVariations(!showVariations)}>{showVariations ? 'Afficher les valeurs cumulées' : 'Afficher les variations quotidiennes'}</a>}

          <div className='chart-container'>
            <Chart reports={report.history.filter(r => date >= r.date)} {...chartOptions} />

            <div className='charts-list'>
              {Object.keys(charts).map(chart => (
                <div key={chart} className='button-container'>
                  <div
                    className={`chart-name ${chart === selectedChart ? 'selected' : ''}`}
                    onClick={() => setSelectedChart(chart)}
                  >
                    {charts[chart].name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

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

        .chart-container {
          margin: ${isMobileDevice ? '0 0.2em' : '0 1em'};
        }

        .charts-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          grid-gap: 0.2em;
          margin: 0.3em;
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
