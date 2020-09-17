import React, {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {ChevronDown, ChevronUp} from 'react-feather'

import {ThemeContext, AppContext} from '../pages'

import colors from '../styles/colors'

const SelectInput = ({selected, options, handleSelect}) => {
  const [isOpen, setIsOpen] = useState(false)

  const theme = useContext(ThemeContext)
  const {isTabletDevice} = useContext(AppContext)

  const onSelect = useCallback(option => {
    handleSelect(option)
    setIsOpen(false)
  }, [handleSelect])

  return (
    <div className='select-input'>
      <div className='custom-select' onClick={() => setIsOpen(!isOpen)}>
        <span>{selected.label}</span> {isOpen ? <ChevronDown /> : <ChevronUp />}
      </div>

      {isOpen && (
        <div className='custom-options'>
          {options.map(option => {
            const {value, label} = option
            return (
              <div
                key={value}
                className={`option ${value === selected.value ? 'selected' : ''}`}
                onClick={() => onSelect(option)}
              >
                <span>{label}</span>
              </div>
            )
          })}
        </div>
      )}

      <style jsx>{`
        .select-input {
          position: relative;
          display: flex;
          flex-direction: column;
          width: ${isTabletDevice ? '100%' : ''};
          height: ${isTabletDevice ? '100%' : ''};
          background-color: ${colors.lightGrey};
        }

        .custom-select {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: ${isTabletDevice ? '0.8em' : '0.5em'};;
        }

        .custom-select,
        .select-input:hover {
          cursor: pointer;
        }

        .custom-options {
          display: flex;
          z-index: 1;
          position: absolute;
          top: 100%;
          width: 100%;
          flex-direction: column;
          background-color: ${colors.lighterGrey};
          box-shadow: 0 1px 4px ${colors.lightGrey};
          transition: height 1s;
        }

        .option {
          display: flex;
          align-items: center;
          padding: 0.5em 1em;
        }

        .option:hover {
          background-color: ${theme.secondary};
          color: #fff;
        }

        .option.selected {
          background-color: ${theme.primary};
          color: #fff;
        }

        span {
          margin-right: 0.4em;
        }
        `}</style>
    </div>
  )
}

SelectInput.propTypes = {
  selected: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }).isRequired,
  options: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}

export default SelectInput
