import React, {useContext, useState} from 'react'

import {AppContext, ThemeContext} from '../pages'

import Counters from './counters'
import MixedChart from './charts/mixed-chart'
import ConfirmesChart from './charts/confirmes-chart'
import DecesChart from './charts/deces-chart'
import ReanimationChart from './charts/reanimation-chart'
import HospitalisesChart from './charts/hospitalises-chart'

const charts = {
  mixed: {
    name: 'Tout afficher',
    chart: MixedChart
  },
  hospitalises: {
    name: 'Hospitalisés',
    chart: HospitalisesChart
  },
  reanimation: {
    name: 'Réanimation',
    chart: ReanimationChart
  },
  confirmed: {
    name: 'Cas confirmés',
    chart: ConfirmesChart
  },
  deces: {
    name: 'Décès',
    chart: DecesChart
  }
}

const NationalStatistics = () => {
  const {date, franceReport, isMobileDevice} = useContext(AppContext)
  const Theme = useContext(ThemeContext)

  const [selectedChart, setSelectedChart] = useState('mixed')
  const Chart = charts[selectedChart].chart

  return (
    <>
      <Counters report={franceReport} />

      {franceReport && franceReport.history && (
        <div>
          <Chart data={franceReport.history.filter(r => date >= r.date)} height={isMobileDevice ? 280 : 300} />
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
          </div>
        </div>
      )}

      <style jsx>{`
        .charts-list {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          align-items: center;
        }

        .chart-name {
          background-color: ${Theme.alt};
          color: #fff;
          border-radius: 4px;
          margin: .2em 0;
          padding: 0.2em 0.4em;
        }

        .chart-name:hover {
          cursor: pointer;
          background-color: ${Theme.secondary};
        }

        .chart-name.selected {
          background-color: ${Theme.primary};
        }
        `}</style>
    </>
  )
}

export default NationalStatistics
