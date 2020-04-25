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


function calculateDelta(todayData,yesterdayData){
  if(!todayData){
    return 0
  }
  if(!yesterdayData){
    return todayData.casConfirmes
  }
  return todayData.casConfirmes - yesterdayData.casConfirmes
  
}
function formatData(label,   reports, color) {
  const datasets = []

  if (reports.some(report => report.casConfirmes)) {
    datasets.push({
      label,
      data: reports.map((report,index) => calculateDelta(report,reports[index-1])),
      backgroundColor: colors[color],
     })
  }
   return {
    labels: reports.filter(r=>r.casConfirmes).map(report => new Date(report.date)),
    datasets
  }
}

const IndicateurCumulChart = ({label,   reports, color, height}) => (
  <Bar data={formatData(label,   reports, color)} options={options} height={height} />
)

IndicateurCumulChart.defaultProps = {
  height: null,
  color: 'darkGrey',
  label: 'Nouveaux cas',
}

IndicateurCumulChart.propTypes = {
  label: PropTypes.string.isRequired,
  reports: PropTypes.array.isRequired,
  color: PropTypes.string,
  height: PropTypes.number
}
 
export default IndicateurCumulChart
