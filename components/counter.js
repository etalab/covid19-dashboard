import React from 'react'
import PropTypes from 'prop-types'

import {Info} from 'react-feather'
import ReactTooltip from 'react-tooltip'
import colors from '../styles/colors'
import {formatInteger} from '../lib/numbers'

const Counter = ({value, label, color, previousValue, details, onClick, isSelected}) => {
  const difference = (Number.isInteger(value) && Number.isInteger(previousValue) && value - previousValue !== 0) ? value - previousValue : null
  return (
    <div className={`counter-container ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className='counter'>
        <div className='value'>
          {typeof value === 'number' ? formatInteger(value) : '-'}
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
            ( {formatInteger(difference, true)} )
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
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          text-align: center;
          margin: 1em 0;
          background-color: ${colors[color]};
        }

        .counter-container {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          margin: .5em;
          background-color: ${colors[color]};
          border: 2px solid white;
        }

        .counter-container:hover {
          cursor: ${onClick ? 'pointer' : ''};
          border: ${onClick ? '2px solid black' : ''};
        }

        .counter-container:active {
          transform: ${onClick ? 'translate(1px, 1px)' : ''};
        }

        .counter-container.selected {
          border: 2px solid black;
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
  details: null,
  onClick: null,
  isSelected: false
}

Counter.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  color: PropTypes.string,
  previousValue: PropTypes.number,
  details: PropTypes.string,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool
}

export default Counter
