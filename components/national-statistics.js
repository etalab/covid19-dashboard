import React, {useContext, useState} from 'react'

import colors from '../styles/colors'

import {AppContext} from '../pages'

import Counters from './counters'
import MixedChart from './charts/mixed-chart'
import ConfirmesChart from './charts/confirmes-chart'
import DecesChart from './charts/deces-chart'

const charts = {
  mixed: {
    name: 'Cas confirmés & décès',
    chart: MixedChart
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
          align-items: center;
        }

        .chart-name {
          background-color: ${colors.lightGrey};
          color: #fff;
          border-radius: 4px;
          padding: 0.2em 0.4em;
        }

        .chart-name:hover {
          cursor: pointer;
          background-color: ${colors.darkerGrey};
        }

        .chart-name.selected {
          background-color: ${colors.darkGrey};
        }
        `}</style>
    </>
  )
}

export default NationalStatistics
