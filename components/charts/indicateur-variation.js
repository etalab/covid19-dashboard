import React from 'react'
import PropTypes from 'prop-types'
import {Line} from 'react-chartjs-2'

import colors from '../../styles/colors'

const options = {
  title: {
    display: true
  },
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

function formatData(label, metricName, reports, color) {
  const datasets = []

  const filteredReports = reports.filter(r => metricName in r)

  if (filteredReports.length >= 2) {
    datasets.push({
      label,
      data: filteredReports.slice(1).map((report, i) => report[metricName] - filteredReports[i][metricName]),
      borderColor: colors[color],
      fill: false,
      spanGaps: true
    })
  }

  return {
    labels: filteredReports.slice(1).map(report => new Date(report.date)),
    datasets
  }
}

const IndicateurVariationChart = ({label, metricName, reports, color, height}) => (
  <Line data={formatData(label, metricName, reports, color)} options={options} height={height} />
)

IndicateurVariationChart.defaultProps = {
  height: null,
  color: 'grey'
}

IndicateurVariationChart.propTypes = {
  label: PropTypes.string.isRequired,
  metricName: PropTypes.string.isRequired,
  reports: PropTypes.array.isRequired,
  color: PropTypes.string,
  height: PropTypes.number
}

export default IndicateurVariationChart
