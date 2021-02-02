import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '../../../styles/colors'

import Counter from '../../counter'

import {VaccinationsContext} from '.'
import indicateurs from './indicateurs'

const VaccinationsCounters = props => {
  const {selectedStat, setSelectedStat} = useContext(VaccinationsContext)

  const previousReport = props.previousReport || {}

  const injectionsCountersList = [
    'cumulPremieresInjections'
  ].map(i => indicateurs.find(indicateur => indicateur.name === i))

  const rdvCountersList = [
    'totalPrisesRendezVousSemaine',
    'prisesRendezVousSemaineRang1',
    'prisesRendezVousSemaineRang2'
  ].map(i => indicateurs.find(indicateur => indicateur.name === i))

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
            details={counter.details}
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
            details={counter.details}
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
