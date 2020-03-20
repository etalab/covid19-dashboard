import React from 'react'
import PropTypes from 'prop-types'

import Counter from './counter'

const Counters = ({report}) => {
  const {casConfirmes, hospitalises, reanimation, deces} = report || {}

  return (
    <div className='stats'>
      <div className='counters'>
        <Counter value={casConfirmes || '?'} label='cas confirmés' color='orange' />
        <Counter value={deces || '?'} label='décès' color='red' />
        <Counter value={hospitalises || '?'} label='hospitalisations' color='darkGrey' />
        <Counter value={reanimation || '?'} label='en réanimation' color='darkerGrey' />
      </div>
      <style jsx>{`
        .counters {
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
