import React from 'react'
import PropTypes from 'prop-types'
import {sumBy} from 'lodash'
import {HorizontalBar} from 'react-chartjs-2'

import colors from '../../../styles/colors'

const classesAge = {
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

const getSumOfByAge = (array, index, age) => {
  return sumBy(array.map(item => item[index]), r => r ? r.find(entry => entry.age === age).value : 0)
}

const formatData = data => {
  const datasets = [
    {
      label: 'testés positifs',
      data: Object.keys(classesAge).map(classe => getSumOfByAge(data, 'testsPositifsDetails', classe)),
      backgroundColor: colors.red,
      stack: 'main'
    },
    {
      label: 'testés négatifs',
      data: Object.keys(classesAge).map(classe => getSumOfByAge(data, 'testsRealisesDetails', classe) - getSumOfByAge(data, 'testsPositifsDetails', classe)),
      backgroundColor: colors.lightGrey,
      stack: 'main'
    }
  ]

  return {
    labels: Object.keys(classesAge).map(classe => classesAge[classe]),
    datasets
  }
}

const CovidTestsAgeChart = ({reports}) => {
  return (
    <HorizontalBar data={formatData(reports)} opitions={options} />
  )
}

CovidTestsAgeChart.propTypes = {
  reports: PropTypes.array.isRequired
}

export default CovidTestsAgeChart
