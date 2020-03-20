import React, {useContext} from 'react'
import {ChevronLeft, ChevronRight} from 'react-feather'

import {AppContext} from '../pages'

import theme from '../styles/theme'
import colors from '../styles/colors'

const formatDate = isoString => {
  const date = new Date(isoString)

  return date.toLocaleDateString()
}

const DateNav = () => {
  const {date, prev, next} = useContext(AppContext)
  const formatedDate = formatDate(date)

  return (
    <div className='menu-header'>
      <div className={`report-nav ${prev ? '' : 'disabled'}`} onClick={prev}><ChevronLeft /></div>
      <h2>Données au {formatedDate}</h2>
      <div className={`report-nav ${next ? '' : 'disabled'}`} onClick={next}><ChevronRight /></div>

      <style jsx>{`
        .menu-header {
          z-index: 2;
          display: flex;
          flex-flow: nowrap;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          box-shadow: 0 1px 4px ${colors.lightGrey};
          padding: 1em;
          background-color: ${colors.blue};
          color: #fff;
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
            padding: 0.5em 1em;
          }

          .menu-header h2 {
            margin: 0.2em;
          }
        }
      `}</style>
    </div>
  )
}

export default DateNav
