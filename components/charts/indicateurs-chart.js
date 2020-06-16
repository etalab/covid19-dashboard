import React from 'react'
import PropTypes from 'prop-types'
import {Line} from 'react-chartjs-2'
import 'chartjs-plugin-annotation' /* eslint import/no-unassigned-import: 0 */

import colors from '../../styles/colors'

const IndicateursChart = ({metricName, reports, label, min, max}) => {
  const options = {
    responsive: true,
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
      }]
    },
    annotation: {
      annotations: [{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        borderColor: colors.green,
        borderWidth: 2
      },
      {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        borderColor: colors.red,
        borderWidth: 2
      }]
    }
  }

  const formatData = (metricName, reports, label) => {
    const datasets = []

    if (reports) {
      datasets.push({
        label,
        data: reports.map(report => report[metricName] ? report[metricName].toPrecision(3) : null),
        backgroundColor: colors.blue,
        borderColor: colors.blue,
        fill: false,
        spanGaps: true
      })
    }

    return {
      labels: reports.map(report => new Date(report.date)),
      datasets
    }
  }

  options.annotation.annotations[0].value = min
  options.annotation.annotations[1].value = max

  return (
    <Line data={formatData(metricName, reports, label)} options={options} />
  )
}

IndicateursChart.propTypes = {
  metricName: PropTypes.string.isRequired,
  reports: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired
}

export default IndicateursChart
