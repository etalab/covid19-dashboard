import React from 'react'
import PropTypes from 'prop-types'
import {ChevronLeft, ChevronRight} from 'react-feather'

import colors from '../styles/colors'

import Counter from './counter'
import ConfirmedChart from './confirmed-chart'

import theme from '../styles/theme'

import {previousDates} from '../lib/dates'

const formatDate = isoString => {
  const date = new Date(isoString)

  return date.toLocaleDateString()
}

const Menu = ({date, report, previousReport, nextReport}) => {
  const formatedDate = formatDate(date)
  const {casConfirmes, deces, history} = report || {}

  return (
    <div className='menu-container'>
      <div className='menu-header'>
        <div className={`report-nav ${previousReport ? '' : 'disabled'}`} onClick={previousReport}><ChevronLeft /></div>
        <h2>Données du {formatedDate}</h2>
        <div className={`report-nav ${nextReport ? '' : 'disabled'}`} onClick={nextReport}><ChevronRight /></div>
      </div>

      <div className='content'>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula, nunc luctus pellentesque tempor, ante purus tincidunt mauris, ut ultricies metus mauris eget neque. Integer posuere tempor ullamcorper. Maecenas maximus velit sed magna rutrum, in posuere nisi sodales. Mauris laoreet dignissim odio, eget lacinia libero iaculis quis.
        </p>

        <div className='stats'>
          <div className='counters'>
            <Counter value={casConfirmes || '?'} label='cas confirmés' color='orange' />
            <Counter value={deces || '?'} label='décès' color='red' />
          </div>
        </div>

        {history && (
          <ConfirmedChart data={history.filter(r => previousDates(date, r.date))} />
        )}
      </div>

      <div className='menu-footer'>
        <div>Tableau de bord COVID19-FR</div>
      </div>
      <style jsx>{`
        .menu-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }

        .menu-container > div {
          padding: 1em;
        }

        .menu-container .menu-header {
          display: flex;
          flex-flow: nowrap;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          box-shadow: 0 1px 4px ${colors.lightGrey};
        }

        .report-nav.disabled {
          color: ${colors.lighterGrey};
        }

        .report-nav.disabled:hover {
          cursor: initial;
        }

        .report-nav:hover {
          cursor: pointer;
          backgroundColor: ${colors.grey};
        }

        .menu-container .content {
          flex: 1;
          overflow-y: scroll;
        }

        .menu-container .stats {
          flex: 1;
        }

        .counters {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .menu-container .menu-footer {
          text-align: center;
          background: ${colors.lightGrey};
        }

        @media (max-width: ${theme.mobileDisplay}) {
          .menu-container .menu-header {
            font-size: small;
          }

          .menu-container > div {
            padding: 0.5em 1em;
          }

          .menu-container h2 {
            margin: 0.2em;
          }
        }
    `}</style>
    </div>
  )
}

Menu.defaultProps = {
  report: {},
  previousReport: null,
  nextReport: null
}

Menu.propTypes = {
  date: PropTypes.string.isRequired,
  report: PropTypes.object,
  previousReport: PropTypes.func,
  nextReport: PropTypes.func
}

export default Menu
