import React from 'react'
import PropTypes from 'prop-types'

import colors from '../styles/colors'

const Counter = ({value, label, color, previousValue}) => {
  const difference = (Number.isInteger(value) && Number.isInteger(previousValue) && value - previousValue !== 0) ? value - previousValue : null

  return (
    <div className='counter-container'>
      <div className='counter'>
        <div className='value'>{value ? value : '?'}</div>
        {difference && (
          <div className='difference'>
            ( {Math.sign(difference) === 1 ? '+' : ''}{difference} )
          </div>
        )}
        <div>{label}</div>
      </div>

      <style jsx>{`
        .counter {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          text-align: center;
          margin: 1em 0;
          color: ${colors[color]};
        }

        .counter-container {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }

        .difference {
          font-size: small;
          font-style: italic;
        }

        .value {
          font-size: xx-large;
          font-weight: bold;
        }
        `}</style>
    </div>
  )
}

Counter.defaultProps = {
  value: null,
  label: null,
  color: 'almostBlack',
  previousValue: null
}

Counter.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  color: PropTypes.string,
  previousValue: PropTypes.number
}

export default Counter
