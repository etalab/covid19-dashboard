import React from 'react'
import PropTypes from 'prop-types'

import Counter from './counter'

const Counters = ({report}) => {
  const {casConfirmes, hospitalises, reanimation, deces} = report || {}

  return (
    <div className='stats'>
      <div className='counters'>
        <Counter value={casConfirmes || '?'} label='cas confirmés' color='orange' />
        <Counter value={hospitalises || '?'} label='hospitalisés' color='darkGrey' />
        <Counter value={reanimation || '?'} label='réanimation' color='darkerGrey' />
        <Counter value={deces || '?'} label='décès' color='red' />
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
