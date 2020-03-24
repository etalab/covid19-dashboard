import React from 'react'
import PropTypes from 'prop-types'

import colors from '../styles/colors'

const Counter = ({value, label, color, difference}) => {
  return (
    <div className='counter-container'>
      <div className='counter'>
        <div className='value'>{value}</div>
        {difference && (
          <div className='difference'>
            ( {Math.sign(difference) === 1 ? '+ ' : ''}{difference} )
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
          background-color: white;
          border-radius: .5em;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          margin: 1em;
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
  label: null,
  color: 'almostBlack',
  difference: null
}

Counter.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
  difference: PropTypes.string
}

export default Counter
