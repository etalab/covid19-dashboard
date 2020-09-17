import React from 'react'
import PropTypes from 'prop-types'
import {Bar} from 'react-chartjs-2'

import colors from '../../styles/colors'

const options = {
  legend: {
    display: false
  },
  tooltips: {
    mode: 'index',
    filter(item) {
      return item.value !== 'NaN'
    }
  },
  scales: {
    xAxes: [{
      stacked: true,
      type: 'time',
      time: {
        unit: 'day',
        displayFormats: {
          day: 'DD/MM'
        },
        tooltipFormat: 'DD/MM'
      },
      gridLines: {
        offsetGridLines: true
      },
      offset: true
    }],
    yAxes: [{
      stacked: true,
      ticks: {
        beginAtZero: true
      }
    }]
  }
}
const formatData = data => {
  const datasets = []

  if (data.some(h => h.testsPositifs)) {
    datasets.push({
      label: 'Tests positifs',
      data: data.map(h => h.testsPositifs || null),
      backgroundColor: colors.red
    })
  }

  if (data.some(h => h.testsRealises)) {
    datasets.push({
      label: 'Tests négatifs',
      data: data.map(h => {
        return h.testsRealises - (h.testsPositifs || 0)
      }),
      backgroundColor: colors.darkGrey
    })
  }

  return {
    labels: data.map(h => new Date(h.date)),
    datasets
  }
}

const CovidTestsMixedChart = ({reports, height}) => (
  <Bar data={formatData(reports)} options={options} height={height} />
)

CovidTestsMixedChart.defaultProps = {
  height: null
}

CovidTestsMixedChart.propTypes = {
  reports: PropTypes.array.isRequired,
  height: PropTypes.number
}

export default CovidTestsMixedChart
