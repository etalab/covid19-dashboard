import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {ChevronLeft, ChevronRight} from 'react-feather'

import {AppContext, ThemeContext} from '../pages'
import {getNextDate, getPreviousDate} from '../lib/data'

import theme from '../styles/theme'

import {formatDate} from '../lib/date'

const DateNav = ({disabled}) => {
  // Creating a event listener on each stroke to avoid the issue of data not being refreshed inside the function
  // This is due to functionnal component relying on closure and the function passed to the event being "pulled" on top
  useEffect(() => {
    // Checking if we are on the client or server side
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown)
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  })

  const themeContext = useContext(ThemeContext)
  const {date, setDate} = useContext(AppContext)
  const formatedDate = formatDate(date)
  const previousDate = getPreviousDate(date)
  const nextDate = getNextDate(date)

  const handleKeyDown = event => {
    if (!disabled) {
      if (event.key === 'ArrowLeft' && previousDate) {
        setDate(previousDate)
      } else if (event.key === 'ArrowRight' && nextDate) {
        setDate(nextDate)
      }
    }
  }

  return (
    <div className='menu-header'>
      {!disabled && (
        <>
          <div
            className={`report-nav ${previousDate ? '' : 'disabled'}`}
            onClick={previousDate ? () => setDate(previousDate) : null}
          >
            <ChevronLeft />
          </div>
          <h3>Données au {formatedDate}</h3>
          <div
            className={`report-nav ${nextDate ? '' : 'disabled'}`}
            onClick={nextDate ? () => setDate(nextDate) : null}
          >
            <ChevronRight />
          </div>
        </>
      )}

      <style jsx>{`
        .menu-header {
          z-index: 2;
          display: flex;
          flex-flow: nowrap;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          padding: 0 1em;
          background-color: ${themeContext.primary};
          color: #fff;
        }

        .menu-header h3 {
          margin: 0.5em;
        }

        .report-nav {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .report-nav.disabled {
          color: #ffffff55;
        }

        .report-nav.disabled:hover {
          cursor: initial;
        }

        .report-nav:hover {
          cursor: pointer;
        }

        @media (max-width: ${theme.mobileDisplay}) {
          .menu-header {
            font-size: small;
            padding: ${disabled ? '1.7em 1em' : '0.5em 1em'};
          }

          .menu-header h3 {
            margin: 0.2em;
          }
        }

        @media (max-width: 1320px) {
          .menu-header {
            font-size: small;
          }
        }
      `}</style>
    </div>
  )
}

DateNav.defaultProps = {
  disabled: false
}

DateNav.propTypes = {
  disabled: PropTypes.bool
}

export default DateNav
