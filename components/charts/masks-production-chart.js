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
    datasets.push({
      label: 'Production Française',
      data: data.map(r => r[`${type}Fr`]),
      backgroundColor: colors.darkBlue
    })

    datasets.push({
      label: 'Import Chine',
      data: data.map(r => r[`${type}Chine`]),
      backgroundColor: colors.lightBlue
    })

    datasets.push({
      label: 'Distribution',
      data: data.map(r => r[`${type}Distribution`]),
      backgroundColor: colors.lighterBlue
    })
  }

  return {
    labels: data.map(r => r.date),
    datasets
  }
}

const MasksProductionChart = ({data, type, height}) => {
  return (
    <Bar data={formatData(data, type)} options={options} height={height} />
  )
}

MasksProductionChart.defaultProps = {
  height: null
}

MasksProductionChart.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  height: PropTypes.number
}

export default MasksProductionChart
