import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Info} from 'react-feather'

import colors from '../styles/colors'

import {formatDate} from '../lib/date'

import {ThemeContext} from '../pages'

import theme from '../styles/theme'

const DateWarning = ({date}) => {
  const themeContext = useContext(ThemeContext)
  return (
    <div className='date-warning'>
      <div><Info /></div>
      <div>Les données du jour sélectionné ne sont pas encore disponibles. Les données affichées sont celles du <b>{formatDate(date)}</b>.</div>

      <style jsx>{`
      .date-warning {
        display: flex;
        color: #fff;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 0.4em;
        background-color: ${themeContext.secondary};
        box-shadow: 0 1px 4px ${colors.lightGrey};
      }

      .date-warning b {
        text-decoration: underline;
      }

      .date-warning > div {
        margin: 0 0.2em;
      }

      @media (max-width: ${theme.mobileDisplay}) {
        .date-warning {
          font-size: 0.8em;
          box-shadow: none;
        }
      }
    `}</style>
    </div>
  )
}

DateWarning.propTypes = {
  date: PropTypes.string.isRequired
}

export default DateWarning
