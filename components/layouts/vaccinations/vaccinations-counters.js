import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '../../../styles/colors'

import Counter from '../../counter'

import {VaccinationsContext} from '.'

const VaccinationsCounters = props => {
  const {selectedStat, setSelectedStat} = useContext(VaccinationsContext)

  const previousReport = props.previousReport || {}

  const details = {
    cumulPremieresInjections: 'Nombre total de premières doses de vaccin injectées à J-1',
    totalPrisesRendezVousSemaine: 'Nombre de rendez-vous pris par semaine dans les centres de vaccination',
    prisesRendezVousSemaineRang1: 'Nombre de rendez-vous pris par semaine dans les centres de vaccination pour l’injection d’une première dose',
    prisesRendezVousSemaineRang2: 'Nombre de rendez-vous pris par semaine dans les centres de vaccination pour l’injection d’une seconde dose'
  }

  const injectionsCountersList = [
    {
      name: 'cumulPremieresInjections',
      label: 'premières doses injectées (cumul)',
      color: 'greenSoft'
    }
  ]

  const rdvCountersList = [
    {
      name: 'totalPrisesRendezVousSemaine',
      label: 'rendez-vous pris par semaine (cumul)',
      color: 'darkGrey'
    },
    {
      name: 'prisesRendezVousSemaineRang1',
      label: 'rendez-vous pris par semaine pour une première injection',
      color: 'blueSoft'
    },
    {
      name: 'prisesRendezVousSemaineRang2',
      label: 'rendez-vous pris par semaine pour une seconde injection',
      color: 'purple'
    }
  ]

  const handleClick = chartName => {
    setSelectedStat(chartName)
  }

  return (
    <div className='stats'>

      <div className='title'>Injections</div>
      <div className='counters'>
        {injectionsCountersList.map(counter => (
          <Counter
            key={counter.name}
            isSelected={selectedStat === counter.name}
            onClick={() => handleClick(counter.name)}
            value={props.report[counter.name]}
            previousValue={previousReport[counter.name]}
            label={counter.label}
            details={details[counter.name]}
            color={counter.color}
          />
        ))}
      </div>

      <div className='title'>Rendez-vous</div>
      <div className='counters'>
        {rdvCountersList.map(counter => (
          <Counter
            key={counter.name}
            isSelected={selectedStat === counter.name}
            onClick={() => handleClick(counter.name)}
            value={props.report[counter.name]}
            previousValue={previousReport[counter.name]}
            label={counter.label}
            details={details[counter.name]}
            color={counter.color}
          />
        ))}
      </div>

      <style jsx>{`
        .stats {
          background-color: ${colors.lighterGrey};
        }

        .counters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        }

        .title {
          text-align: center;
          font-size: large;
          font-weight: bold;
          padding: .5em;
          margin-top: .5em;
          border-top: 1px solid ${colors.white};
        }

        .info {
          font-size: small;
          padding: 0 1.5em;
          color: orange;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

VaccinationsCounters.defaultProps = {
  report: {},
  previousReport: {}
}

VaccinationsCounters.propTypes = {
  report: PropTypes.object,
  previousReport: PropTypes.object
}

export default VaccinationsCounters
