import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '../styles/colors'

import {formatInteger} from '../lib/numbers'

import {AppContext} from '../pages'

import Tooltip from './tooltip'

const Counter = ({value, label, color, previousValue, details, diffDetail, warningLabel, onClick, isPercent, isSelected, isBig}) => {
  const difference = (Number.isInteger(value) && Number.isInteger(previousValue) && value - previousValue !== 0) ? value - previousValue : null
  const {isMobileDevice} = useContext(AppContext)

  return (
    <div className='counter-container'>
      <div className={`counter ${onClick ? 'clickable' : ''} ${isSelected ? 'selected' : ''}`} onClick={onClick}>
        <div className='warning-icon'>
          {warningLabel && <Tooltip tip={warningLabel} id='warningPosition' icon='⚠️' />}
        </div>

        <div className='value'>
          {typeof value === 'number' ? formatInteger(value) : '-'} {isPercent && '%'}
          <div className=''>
            {details && <Tooltip tip={details} id='overridePosition' />}
          </div>
        </div>
        {difference && (
          <div className='difference'>
            ( {formatInteger(difference, true)} )
            {diffDetail && (
              <Tooltip
                id='diffDetail'
                tip={diffDetail}
              />
            )}
          </div>
        )}
        <div>{label}</div>
      </div>

      <style jsx>{`
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
          cursor: ${onClick ? 'pointer' : 'auto'};
        }

        .counter-container {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }

        .clickable:hover {
          border: 1px solid ${colors.blue};
        }

        .counter.selected {
          border: 1px solid ${colors.blue};
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
  diffDetail: null,
  warningLabel: null,
  onClick: null,
  isPercent: false,
  isSelected: false,
  isBig: false
}

Counter.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  color: PropTypes.string,
  previousValue: PropTypes.number,
  details: PropTypes.string,
  diffDetail: PropTypes.string,
  warningLabel: PropTypes.string,
  onClick: PropTypes.func,
  isPercent: PropTypes.bool,
  isSelected: PropTypes.bool,
  isBig: PropTypes.bool
}

export default Counter
