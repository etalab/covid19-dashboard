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

  if (data.some(h => h.decesEhpad)) {
    datasets.push({
      label: 'Décès en EHPAD et EMS',
      data: data.map(h => h.decesEhpad || null),
      backgroundColor: colors.darkRed
    })
  }

  if (data.some(h => h.deces)) {
    datasets.push({
      label: 'Décès à l’hôpital',
      data: data.map(h => h.deces || null),
      backgroundColor: colors.red
    })
  }

  if (data.some(h => h.reanimation)) {
    datasets.push({
      label: 'En réanimation',
      data: data.map(h => h.reanimation || null),
      backgroundColor: colors.darkerGrey
    })
  }

  if (data.some(h => h.hospitalises)) {
    datasets.push({
      label: 'Autre hospitalisation',
      data: data.map(h => {
        if (h.hospitalises) {
          return h.hospitalises - (h.reanimation || 0)
        }

        return null
      }),
      backgroundColor: colors.darkGrey
    })
  }

  if (data.some(h => h.gueris)) {
    datasets.push({
      label: 'Retours à domicile',
      data: data.map(h => h.gueris || null),
      backgroundColor: colors.green
    })
  }

  if (data.some(h => h.casConfirmes)) {
    datasets.push({
      label: 'Autre',
      data: data.map(h => {
        return h.casConfirmes - ((h.gueris || 0) + (h.deces || 0) + (h.decesEhpad || 0) + (h.hospitalises || h.reanimation || 0))
      }),
      backgroundColor: colors.orange
    })
  }

  return {
    labels: data.map(h => new Date(h.date)),
    datasets
  }
}

const MixedChart = ({reports, height}) => (
  <Bar data={formatData(reports)} options={options} height={height} />
)

MixedChart.defaultProps = {
  height: null
}

MixedChart.propTypes = {
  reports: PropTypes.array.isRequired,
  height: PropTypes.number
}

export default MixedChart
