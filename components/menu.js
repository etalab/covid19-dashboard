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
          L‘information officielle sur la progression de l’épidémie en France est très fragmentée.
        </p>
        <p>
          <a href='https://www.santepubliquefrance.fr'>Santé publique France</a> propose un point épidémiologique quotidien, qui comprend les chiffres-clés nationaux, et le nombre de cas confirmés par région.
        </p>
        <p>
          Les agences régionales de santé et les préfectures publient de leur côté des informations au niveau départemental, ainsi que le nombre de personnes décédées ou en réanimation.
        </p>
        <p>
          Cet outil contributif tente de proposer une <a href='https://www.data.gouv.fr/fr/datasets/chiffres-cles-concernant-lepidemie-de-covid19-en-france/'>vision consolidée</a> des données officielles disponibles.
        </p>

        <div className='stats'>
          <div className='counters'>
            <Counter value={casConfirmes || '?'} label='cas confirmés' color='orange' />
            <Counter value={deces || '?'} label='décès' color='red' />
          </div>
        </div>

        {history && (
          <ConfirmedChart data={history.filter(r => previousDates(date, r.date))} height={300} />
        )}
      </div>

      <div className='menu-footer'>
        <div>[<a href='https://github.com/opencovid19-fr/dashboard'>GitHub</a>]</div>
      </div>
      <style jsx>{`
        .menu-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background-color: #fff;
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
          background-color: ${colors.grey};
        }

        .menu-container .content {
          flex: 1;
          overflow-y: scroll;
        }

        .menu-container .content p {
          font-size: 0.85em;
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
