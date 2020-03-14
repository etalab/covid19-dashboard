import React from 'react'
import PropTypes from 'prop-types'
import {Bar} from 'react-chartjs-2'

import colors from '../styles/colors'

const options = {
  tooltips: {
    mode: 'index'
  },
  scales: {
    xAxes: [{
      stacked: true
    }],
    yAxes: [{
      stacked: true
    }]
  }
}

const formatData = data => {
  const datasets = []

  if (data.some(h => h.casConfirmes)) {
    datasets.push({
      label: 'En vie',
      data: data.map(h => h.casConfirmes - (h.deces || 0)),
      backgroundColor: colors.orange
    })
  }

  if (data.some(h => h.deces)) {
    datasets.push({
      label: 'Décédés',
      data: data.map(h => h.deces),
      backgroundColor: colors.red
    })
  }

  return {
    labels: data.map(h => h.date),
    datasets
  }
}

const ConfirmedChart = ({data, height}) => (
  <div style={{padding: '1em'}}>
    <Bar data={formatData(data)} options={options} height={height} />
  </div>
)

ConfirmedChart.defaultProps = {
  height: null
}

ConfirmedChart.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number
}

export default ConfirmedChart
