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
        offsetGridLines: true,
        display: false
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

function formatData(label, metricName, reports, color) {
  const datasets = []

  const filteredReports = reports.filter(r => metricName in r)

  if (filteredReports.length > 0) {
    datasets.push({
      label,
      data: filteredReports.map(report => report[metricName]),
      backgroundColor: colors[color]
    })
  }

  return {
    labels: filteredReports.map(report => new Date(report.date)),
    datasets
  }
}

const IndicateurCumulChart = ({label, metricName, reports, color, height}) => (
  <Bar data={formatData(label, metricName, reports, color)} options={options} height={height} />
)

IndicateurCumulChart.defaultProps = {
  height: null,
  color: 'grey'
}

IndicateurCumulChart.propTypes = {
  label: PropTypes.string.isRequired,
  metricName: PropTypes.string.isRequired,
  reports: PropTypes.array.isRequired,
  color: PropTypes.string,
  height: PropTypes.number
}

export default IndicateurCumulChart
