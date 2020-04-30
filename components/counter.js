import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {AppContext} from '../pages'

import {Info} from 'react-feather'
import ReactTooltip from 'react-tooltip'
import colors from '../styles/colors'
import {formatInteger} from '../lib/numbers'

const Counter = ({value, label, color, previousValue, details, warningLabel, isBig}) => {
  const difference = (Number.isInteger(value) && Number.isInteger(previousValue) && value - previousValue !== 0) ? value - previousValue : null
  const {isMobileDevice} = useContext(AppContext)

  return (
    <div className='counter-container'>
      <div className='counter'>
        {warningLabel && (
          <div className='warning-icon' data-tip={warningLabel} data-for='warningPosition'>⚠️
            <ReactTooltip
              id='warningPosition'
              backgroundColor='rgba(0, 0, 0)'
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
        )}
        <div className='value'>
          {typeof value === 'number' ? formatInteger(value) : '-'}
          <div className='hover'>
            {details && <Info size={12} data-tip={details} data-for='overridePosition' />}
            <ReactTooltip
              id='overridePosition'
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
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          text-align: center;
          margin: ${isMobileDevice ? '.1em' : '.5em'};
          color: ${colors[color]};
          background-color: ${colors.white};
          border-radius: .5em;
          border: 1px solid ${colors.lightGrey};
          padding: ${isBig ? '1.2em' : '1em'};
        }

        .counter-container {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }

        .warning-icon {
          position: absolute;
          top: 0;
          left: 10px;
          cursor: default;
        }

        .difference {
          font-size: small;
          font-style: italic;
        }

        .value {
          font-size: ${isBig ? 'xx-large' : 'x-large'};
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
  warningLabel: null,
  isBig: false
}

Counter.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  color: PropTypes.string,
  previousValue: PropTypes.number,
  details: PropTypes.string,
  warningLabel: PropTypes.string,
  isBig: PropTypes.bool
}

export default Counter
