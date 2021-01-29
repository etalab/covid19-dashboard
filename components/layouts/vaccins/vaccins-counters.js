import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import Counter from '../../counter'
import PieChartPercent from '../../pie-chart-percent'

import {VaccinsContext} from '.'

const VaccinsCounters = props => {
  const {isMobileDevice} = useContext(AppContext)
  const {selectedStat, setSelectedStat} = useContext(VaccinsContext)

  const {report} = props
  const previousReport = props.previousReport || {}

  const details = {
    stockNombreTotalDoses: '',
    stockNombreDosesPfizer: '',
    stockNombreDosesModerna: ''
  }

  const stocksCountersList = [
    {
      name: 'stockNombreTotalDoses',
      label: 'doses en stock',
      color: 'darkGrey'
    },
    {
      name: 'stockNombreDosesPfizer',
      label: 'doses en stock Pfizer',
      color: 'darkBlue'
    },
    {
      name: 'stockNombreDosesModerna',
      label: 'doses en stock Moderna',
      color: 'darkRed'
    }
  ]

  const livraisonsCountersList = [
    {
      name: 'livraisonsCumulNombreTotalDoses',
      label: 'doses livrées',
      color: 'darkGrey'
    },
    {
      name: 'livraisonsCumulNombreDosesPfizer',
      label: 'doses livrées Pfizer',
      color: 'darkBlue'
    },
    {
      name: 'livraisonsCumulNombreDosesModerna',
      label: 'doses livrées Moderna',
      color: 'darkRed'
    }
  ]

  const handleClick = chartName => {
    setSelectedStat(chartName)
  }

  return (
    <div className='stats'>
      <div className='title'>Stocks</div>
      <div className='counters'>
        {stocksCountersList.map(counter => (
          <Counter
            key={counter.name}
            isSelected={selectedStat === counter.name}
            onClick={() => handleClick(counter.name)}
            value={report[counter.name]}
            previousValue={previousReport[counter.name]}
            label={counter.label}
            details={details[counter.name]}
            color={counter.color}
          />
        ))}
      </div>

      {report && report.stockNombreDosesPfizer && report.stockNombreDosesModerna && (
        <PieChartPercent
          data={[report.stockNombreDosesPfizer, report.stockNombreDosesModerna]}
          labels={['Stock doses Pfizer', 'Stock doses Moderna']}
          colors={[colors.darkBlue, colors.darkRed]}
          height={isMobileDevice ? 150 : 130}
        />
      )}

      <div className='title'>Livraisons</div>
      <div className='counters'>
        {livraisonsCountersList.map(counter => (
          <Counter
            key={counter.name}
            isSelected={selectedStat === counter.name}
            onClick={() => handleClick(counter.name)}
            value={report[counter.name]}
            previousValue={previousReport[counter.name]}
            label={counter.label}
            details={details[counter.name]}
            color={counter.color}
          />
        ))}
      </div>

      {report.livraisonsCumulNombreDosesPfizer && report.livraisonsCumulNombreDosesModerna && (
        <PieChartPercent
          data={[report.livraisonsCumulNombreDosesPfizer, report.livraisonsCumulNombreDosesModerna]}
          labels={['Livraisons doses Pfizer', 'Livraisons doses Moderna']}
          colors={[colors.darkBlue, colors.darkRed]}
          height={isMobileDevice ? 150 : 130}
        />
      )}

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

VaccinsCounters.defaultProps = {
  report: {},
  previousReport: {}
}

VaccinsCounters.propTypes = {
  report: PropTypes.object,
  previousReport: PropTypes.object
}

export default VaccinsCounters
