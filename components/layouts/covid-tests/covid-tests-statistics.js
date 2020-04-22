import React, {useContext} from 'react'
import CovidTestsAgeChart from './covid-tests-age-chart'

import {getReport} from '../../../lib/data'

import {AppContext} from '../../../pages'

const CovidTestsStatistics = () => {
  const {date, forcedDate, selectedLocation} = useContext(AppContext)

  const selectedDate = date || forcedDate
  const report = getReport(selectedDate, selectedLocation || 'FRA')

  return (
    <div>
      <CovidTestsAgeChart reports={report.history.filter(r => selectedDate >= r.date)} />
    </div>
  )
}

export default CovidTestsStatistics
