import React from 'react'
import PropTypes from 'prop-types'

import Counter from './counter'

const Statistics = ({report}) => {
  const {casConfirmes, deces} = report || {}

  return (
    <div className='stats'>
      <div className='counters'>
        <Counter value={casConfirmes || '?'} label='cas confirmés' color='orange' />
        <Counter value={deces || '?'} label='décès' color='red' />
      </div>
      <style jsx>{`
        .stats {
          flex: 1;
          padding: 1em;
        }

        .counters {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
      `}</style>
    </div>
  )
}

Statistics.defaultProps = {
  report: {}
}

Statistics.propTypes = {
  report: PropTypes.object
}

export default Statistics
