import React from 'react'
import PropTypes from 'prop-types'

import Counter from './counter'

const Counters = ({report, previousReport}) => {
  const {casConfirmes, hospitalises, reanimation, deces, gueris} = report || {}
  const previousCasConfirmes = previousReport.casConfirmes
  const previousGueris = previousReport.gueris
  const previousDeces = previousReport.deces
  const previousHospitalises = previousReport.hospitalises
  const previousReanimation = previousReport.reanimation


  return (
    <div className='stats'>
      <Counter value={casConfirmes ?? '?'} difference={casConfirmes - previousCasConfirmes || ''} label='cas confirmés' color='orange' />
      <div className='counters'>
        <Counter value={gueris ?? '?'} difference={gueris - previousGueris || ''} label='guéris' color='green' />
        <Counter value={deces ?? '?'} difference={deces - previousDeces || ''} label='décès' color='red' />
        <Counter value={hospitalises ?? '?'} difference={hospitalises - previousHospitalises || ''} label='hospitalisations' color='darkGrey' />
        <Counter value={reanimation ?? '?'} difference={reanimation - previousReanimation || ''} label='en réanimation' color='darkerGrey' />
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
  report: {}
}

Counters.propTypes = {
  report: PropTypes.object
}

export default Counters
