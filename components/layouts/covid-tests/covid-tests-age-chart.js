import React from 'react'
import PropTypes from 'prop-types'
import {HorizontalBar} from 'react-chartjs-2'

import colors from '../../../styles/colors'

const sidepClassesAge = {
  90: 'plus de 90 ans',
  89: '80-89 ans',
  79: '70-79 ans',
  69: '60-69 ans',
  59: '50-59 ans',
  49: '40-49 ans',
  39: '30-39 ans',
  29: '20-29 ans',
  19: '10-19 ans',
  '09': '0-9 ans'
}

const troisLabosClassesAge = {
  E: '75 et plus',
  D: '65-74 ans',
  C: '45-64 ans',
  B: '15-44 ans',
  A: 'moins de 15 ans'
}

const options = {
  scales: {
    yAxes: [{
      stacked: true
    }],
    xAxes: [{
      stacked: true
    }]
  }
}

function getValue(report, key, classeAge) {
  if (!report[key]) {
    return 0
  }

  const item = report[key].find(i => i.age === classeAge)
  return item ? item.value : 0
}

const formatData = report => {
  const classesAge = report.date < '2020-05-13' ? troisLabosClassesAge : sidepClassesAge

  const datasets = [
    {
      label: 'testés positifs',
      data: Object.keys(classesAge).sort().map(classe => getValue(report, 'testsPositifsDetails', classe)),
      backgroundColor: colors.red,
      stack: 'main'
    },
    {
      label: 'testés négatifs',
      data: Object.keys(classesAge).sort().map(classe => getValue(report, 'testsRealisesDetails', classe) - getValue(report, 'testsPositifsDetails', classe)),
      backgroundColor: colors.lightGrey,
      stack: 'main'
    }
  ]

  return {
    labels: Object.keys(classesAge).sort().map(classe => classesAge[classe]),
    datasets
  }
}

const CovidTestsAgeChart = ({report}) => {
  return (
    <HorizontalBar data={formatData(report)} options={options} />
  )
}

CovidTestsAgeChart.propTypes = {
  report: PropTypes.object.isRequired
}

export default CovidTestsAgeChart
