import React, {useContext, useState} from 'react'
import {X, BarChart2} from 'react-feather'

import colors from '../styles/colors'

import {AppContext, ThemeContext} from '../pages'

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
    name: 'Décès',
    chart: DecesChart
  },
  gueris: {
    name: 'Guéris',
    chart: GuerisChart
  }
}

const Statistics = () => {
  const theme = useContext(ThemeContext)
  const {date, setDate, franceReport, selectedLocationReport, setSelectedLocation, isMobileDevice} = useContext(AppContext)

  const report = selectedLocationReport || franceReport

  const [selectedChart, setSelectedChart] = useState('mixed')
  const Chart = charts[selectedChart].chart
 
  const startAnimation = (daysBefore) => {
    let datesIndex = 0;
    const dates = report.history.map(e => e.date).sort().slice(-daysBefore);
    const interval = setInterval(() => {
      // exit condition
      if(datesIndex >= dates.length - 1) {
        clearInterval(interval);
        return ;
      }    
      setDate(dates[++datesIndex])
    }, 400);
  }



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
        <h2>{selectedLocationReport ? selectedLocationReport.nom : 'France'}</h2>
      </div>

      <Counters report={report} />

      {report && report.history && (
        <>
          <Chart data={report.history.filter(r => date >= r.date)} height={isMobileDevice ? 220 : 250} />
          <div className='charts-list'>
            {Object.keys(charts).map(chart => (
              <div
                key={chart}
                className={`chart-name ${chart === selectedChart ? 'selected' : ''}`}
                onClick={() => setSelectedChart(chart)}
              >
                {charts[chart].name}
              </div>
            ))}
            <div className={`chart-name`}
              onClick={() => startAnimation(30)}
            >
              Animation 30 derniers jours
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
          margin: ${isMobileDevice ? '0 -0.5em' : 0};
          padding: 1px;
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

        .charts-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          grid-gap: 0.2em;
          margin: 0.5em;
        }

        .chart-name {
          text-align: center;
          background-color: ${theme.alt};
          color: #fff;
          border-radius: 4px;
          margin: .2em 0;
          padding: 0.2em 0.4em;
        }

        .chart-name:hover {
          cursor: pointer;
          background-color: ${theme.secondary};
        }

        .chart-name.selected {
          background-color: ${theme.primary};
        }
        `}</style>
    </>
  )
}

export default Statistics
