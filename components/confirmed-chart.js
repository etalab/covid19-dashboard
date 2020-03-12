import React from 'react'
import PropTypes from 'prop-types'
import {Bar} from 'react-chartjs-2'

import colors from '../styles/colors'

const options = {
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
  return {
    labels: data.map(h => h.date),
    datasets: [
      {
        label: 'Cas confirmés',
        data: data.map(h => h.casConfirmes),
        backgroundColor: colors.orange
      },
      {
        label: 'Décès',
        data: data.map(h => h.deces),
        backgroundColor: colors.red
      }
    ]
  }
}

const ConfirmedChart = ({data}) => (
  <Bar data={formatData(data)} options={options} height={250} />
)

ConfirmedChart.propTypes = {
  data: PropTypes.array.isRequired
}

export default ConfirmedChart
