import React from 'react'
import PropTypes from 'prop-types'
import {Bar} from 'react-chartjs-2'

import colors from '../../styles/colors'

const options = {
  legend: {
    display: false
  },
  tooltips: {
    mode: 'index'
  },
  scales: {
    xAxes: [{
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
      ticks: {
        beginAtZero: true
      }
    }]
  }
}

const formatData = data => {
  const datasets = []

  if (data.some(h => h.gueris)) {
    datasets.push({
      label: 'Retours à domicile',
      data: data.map(h => h.gueris),
      backgroundColor: colors.green
    })
  }

  return {
    labels: data.map(h => new Date(h.date)),
    datasets
  }
}

const GuerisChart = ({data, height}) => (
  <Bar data={formatData(data)} options={options} height={height} />
)

GuerisChart.defaultProps = {
  height: null
}

GuerisChart.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number
}

export default GuerisChart
