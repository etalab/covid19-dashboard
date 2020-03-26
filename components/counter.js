import React from 'react'
import PropTypes from 'prop-types'

import {Info} from 'react-feather'
import ReactTooltip from 'react-tooltip'
import colors from '../styles/colors'

const Counter = ({value, label, color, previousValue, details}) => {
  const difference = (Number.isInteger(value) && Number.isInteger(previousValue) && value - previousValue !== 0) ? value - previousValue : null

  return (
    <div className='counter-container'>
      <div className='counter'>
        <div className='value'>
          {typeof value === 'number' ? value : '-'}
          <div className='hover'>
            <Info size={12} data-tip={details} data-for='overridePosition' />
            <ReactTooltip
              id='overridePosition'
              className='extra-class'
              backgroundColor='rgba(0, 0, 0, .3)'
              arrowColor='rgba(0, 0, 0, 0)'
              multiline
              overridePosition={(
                {left, top}, currentEvent, currentTarget, node) => {
                const d = document.documentElement
                left = Math.min(d.clientWidth - node.clientWidth, left)
                top = Math.min(d.clientHeight - node.clientHeight, top)
                left = Math.max(0, left)
                top = Math.max(0, top)
                return {top, left}
              }} />
          </div>
        </div>
        {difference && (
          <div className='difference'>
            ( {Math.sign(difference) === 1 ? '+' : ''}{difference} )
          </div>
        )}
        <div>{label}</div>
      </div>

      <style jsx>{`
        .hover {
          display: flex;
          flex-direction: column;
          font-weight: lighter;
        }

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
          margin-right: -12px;
          display: flex;
          justify-content: center;
          flex-direction: row;
        }
        `}</style>
    </div>
  )
}

Counter.defaultProps = {
  value: null,
  label: null,
  color: 'almostBlack',
  previousValue: null,
  details: null
}

Counter.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  color: PropTypes.string,
  previousValue: PropTypes.number,
  details: PropTypes.string
}

export default Counter
