import React from 'react'
import PropTypes from 'prop-types'

import Counter from './counter'

const Counters = ({report}) => {
  const {casConfirmes, hospitalises, reanimation, deces, gueris} = report || {}

  return (
    <div className='stats'>
      <Counter value={casConfirmes ?? '?'} label='cas confirmés' color='orange' />
      <div className='counters'>
        <Counter value={gueris ?? '?'} label='guéris' color='green' />
        <Counter value={deces ?? '?'} label='décès' color='red' />
        <Counter value={hospitalises ?? '?'} label='hospitalisations' color='darkGrey' />
        <Counter value={reanimation ?? '?'} label='en réanimation' color='darkerGrey' />
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
