import React, {useContext} from 'react'

import {AppContext} from '../pages'

import Counters from './counters'
import MixedChart from './mixed-chart'

const NationalStatistics = () => {
  const {date, franceReport} = useContext(AppContext)

  return (
    <>
      <Counters report={franceReport} />

      {franceReport && franceReport.history && (
        <MixedChart data={franceReport.history.filter(r => date >= r.date)} height={300} />
      )}
    </>
  )
}

export default NationalStatistics
