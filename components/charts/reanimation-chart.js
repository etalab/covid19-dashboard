import React from 'react'
import PropTypes from 'prop-types'
import BarChart from './bar-chart'
import colors from '../../styles/colors'

const options = {
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
  }
}

const formatData = data => {
  const datasets = []

  if (data.some(h => h.reanimation)) {
    datasets.push({
      label: 'Réanimation',
      data: data.map(h => h.reanimation),
      backgroundColor: colors.darkerGrey
    })
  }

  return {
    labels: data.map(h => new Date(h.date)),
    datasets
  }
}

const ReanimationChart = ({data, height}) => (<BarChart data={formatData(data)} options={options} height={height} />)

ReanimationChart.defaultProps = {
  height: null
}

ReanimationChart.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number
}

export default ReanimationChart
