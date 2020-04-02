import React, {useContext, useState} from 'react'
import {X, BarChart2} from 'react-feather'

import colors from '../styles/colors'

import {AppContext} from '../pages'

import Counters from './counters'
import MixedChart from './charts/mixed-chart'
import ConfirmesChart from './charts/confirmes-chart'
import DecesChart from './charts/deces-chart'
import ReanimationChart from './charts/reanimation-chart'
import HospitalisesChart from './charts/hospitalises-chart'
import GuerisChart from './charts/gueris-chart'

const charts = {
  mixed: {
    name: 'Tout afficher',
    chart: MixedChart
  },
  confirmed: {
    name: 'Cas confirmés',
    chart: ConfirmesChart
  },
  hospitalises: {
    name: 'Hospitalisations',
    chart: HospitalisesChart
  },
  reanimation: {
    name: 'Réanimations',
    chart: ReanimationChart
  },
  deces: {
    name: 'Décès à l’hôpital',
    chart: DecesChart
  },
  gueris: {
    name: 'Retours à domicile',
    chart: GuerisChart
  }
}

const Statistics = () => {
  const {date, franceReport, previousFranceReport, selectedPreviousLocationReport, selectedLocationReport, setSelectedLocation, isMobileDevice} = useContext(AppContext)

  const report = selectedLocationReport || franceReport
  const previousReport = selectedPreviousLocationReport || previousFranceReport

  const [selectedChart, setSelectedChart] = useState('mixed')
  const Chart = charts[selectedChart].chart

  return (
    <>
      <div className='header'>
        {selectedLocationReport && (
          isMobileDevice ? (
            <div className='close' onClick={() => setSelectedLocation(null)}><X /></div>
          ) : (
            <div className='back' onClick={() => setSelectedLocation(null)}><BarChart2 /> <span>France</span></div>
          )
        )}
        <h2>COVID-19 en {selectedLocationReport ? selectedLocationReport.nom : 'France'}</h2>
      </div>

      <Counters report={report} previousReport={previousReport} />

      {report && report.history && (
        <div className='chart-container'>
          <Chart data={report.history.filter(r => date >= r.date)} />
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
      )}

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
