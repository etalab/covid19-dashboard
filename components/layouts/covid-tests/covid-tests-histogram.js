import React, {useContext, useState} from 'react'
import PropTypes from 'prop-types'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import IndicateurCumulChart from '../../charts/indicateur-cumul'
import IndicateurVariationChart from '../../charts/indicateur-variation'
import CovidTestsMixedChart from '../../charts/covid-tests-mixed-chart'

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

const CovidTestsHistogram = ({reports}) => {
  const {date, isMobileDevice} = useContext(AppContext)

  const [selectedChart, setSelectedChart] = useState('mixed')
  const [showVariations, setShowVariations] = useState(false)

  const toggleable = charts[selectedChart].type === 'indicateur'

  const Chart = getChart(selectedChart, showVariations)
  const chartOptions = charts[selectedChart].options || {}

  return (
    <>
      <>
        {toggleable && <a className='toggle' onClick={() => setShowVariations(!showVariations)}>{showVariations ? 'Afficher les valeurs cumulées' : 'Afficher les variations quotidiennes'}</a>}

        <div className='chart-container'>
          <Chart reports={reports.filter(r => date >= r.date)} {...chartOptions} />

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
      <style jsx>{`
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

CovidTestsHistogram.propTypes = {
  reports: PropTypes.array.isRequired
}

export default CovidTestsHistogram
