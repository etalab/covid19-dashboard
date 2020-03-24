import React from 'react'
import PropTypes from 'prop-types'

import Counter from './counter'

const Counters = ({report, previousReport}) => {
  const {casConfirmes, hospitalises, reanimation, deces, gueris} = report || {}
  const differenceCasConfirmes = casConfirmes - previousReport.casConfirmes || null
  const differenceGueris = gueris - previousReport.gueris || null
  const differenceDeces = deces - previousReport.deces || null
  const differenceHospitalises = hospitalises - previousReport.hospitalises || null
  const differenceReanimation = reanimation - previousReport.reanimation || null

  return (
    <div className='stats'>
      <Counter value={casConfirmes} difference={differenceCasConfirmes} label='cas confirmés' color='orange' />
      <div className='counters'>
        <Counter value={gueris} difference={differenceGueris} label='guéris' color='green' />
        <Counter value={deces} difference={differenceDeces} label='décès' color='red' />
        <Counter value={hospitalises} difference={differenceHospitalises} label='hospitalisations' color='darkGrey' />
        <Counter value={reanimation} difference={differenceReanimation} label='en réanimation' color='darkerGrey' />
      </div>
      <style jsx>{`
        .counters {
          background-color: whitesmoke;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
      `}</style>
    </div>
  )
}

Counters.defaultProps = {
  report: {},
  previousReport: {}
}

Counters.propTypes = {
  report: PropTypes.object,
  previousReport: PropTypes.object
}

export default Counters
