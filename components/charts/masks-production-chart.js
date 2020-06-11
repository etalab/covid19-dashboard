import React from 'react'
import PropTypes from 'prop-types'
import {Bar} from 'react-chartjs-2'

import colors from '../../styles/colors'

const options = {
  maintainAspectRatio: false,
  legend: {
    display: true
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

const formatData = (data, type) => {
  const datasets = []

  if (data) {
    const maxBarThickness = 30

    datasets.push({
      label: 'Production Française',
      data: data.map(r => r[`productionFR${type}`]),
      backgroundColor: colors.darkBlue
    })

    datasets.push({
      label: 'Import Chine',
      data: data.map(r => r[`importChine${type}`]),
      backgroundColor: colors.lightBlue
    })

    datasets.push({
      label: 'Distribution',
      data: data.map(r => r[`distribution${type}`]),
      backgroundColor: colors.lighterBlue
    })

    datasets.map(r => {
      r.maxBarThickness = maxBarThickness
      return r
    })
  }

  return {
    labels: data.map(r => `Semaine ${r.week}`),
    datasets
  }
}

const MasksProductionChart = ({data, type}) => {
  return (
    <Bar data={formatData(data, type)} options={options} />
  )
}

MasksProductionChart.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
}

export default MasksProductionChart
