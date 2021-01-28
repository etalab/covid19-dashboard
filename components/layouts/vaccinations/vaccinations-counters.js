import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '../../../styles/colors'

import Counter from '../../counter'

import {VaccinationsContext} from '.'

const VaccinationsCounters = props => {
  const {
    nouvellesPremieresInjections,
    cumulPremieresInjections,
    stockNombreTotalDoses,
    stockNombreDosesPfizer,
    stockNombreDosesModerna,
    livraisonsCumulNombreTotalDoses,
    livraisonsCumulNombreDosesPfizer,
    livraisonsCumulNombreDosesModerna,
    totalPrisesRendezVousSemaine,
    prisesRendezVousSemaineRang1,
    prisesRendezVousSemaineRang2
  } = props.report || {}
  const {selectedStat, setSelectedStat} = useContext(VaccinationsContext)

  const previousReport = props.previousReport || {}

  const details = {
    cumulPremieresInjections: '',
    stockNombreTotalDoses: '',
    stockNombreDosesPfizer: '',
    stockNombreDosesModerna: ''
  }

  const injectionsCountersList = [
    {
      name: 'cumulPremieresInjections',
      label: 'Nombre de premières doses de vaccin injectées',
      color: 'green'
    },
    {
      name: 'stockNombreTotalDoses',
      label: 'Nombre total de doses de vaccins',
      color: 'darkGrey'
    }
  ]

  const stocksCountersList = [
    {
      name: 'stockNombreDosesPfizer',
      label: 'Nombre de doses Pfizer en stock',
      color: 'darkGrey'
    },
    {
      name: 'stockNombreDosesModerna',
      label: 'Nombre de doses Moderna en stock',
      color: 'darkGrey'
    }
  ]

  const livraisonsCountersList = [
    {
      name: 'livraisonsCumulNombreTotalDoses',
      label: 'Nombre total des doses livrais',
      color: 'darkGrey'
    },
    {
      name: 'livraisonsCumulNombreDosesPfizer',
      label: 'Nombre total des doses Pfizer livrais',
      color: 'darkGrey'
    },
    {
      name: 'livraisonsCumulNombreDosesModerna',
      label: 'Nombre total des doses Moderna livrais',
      color: 'darkGrey'
    }
  ]

  const handleClick = chartName => {
    setSelectedStat(chartName)
  }

  return (
    <div className='stats'>
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

      <div className='title'>Stocks</div>
      <div className='counters'>
        {stocksCountersList.map(counter => (
          <Counter
            key={counter.name}
            isSelected={selectedStat === counter.name}
            value={props.report[counter.name]}
            previousValue={previousReport[counter.name]}
            label={counter.label}
            details={details[counter.name]}
            color={counter.color}
          />
        ))}
      </div>

      <div className='title'>Livraisons</div>
      <div className='counters'>
        {livraisonsCountersList.map(counter => (
          <Counter
            key={counter.name}
            isSelected={selectedStat === counter.name}
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
