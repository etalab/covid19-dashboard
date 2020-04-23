import React from 'react'
import PropTypes from 'prop-types'

import Counter from '../../counter'

import colors from '../../../styles/colors'

const CovidTestsCounters = ({testsPositifs, testsRealises}) => {
  return (
    <div className='stats'>
      <div className='title'>Tests PCR en laboratoires de ville</div>
      <div className='counters'>
        <Counter value={testsRealises} label='Tests réalisés' details='Nombre total de tests pour recherche de SARS-COV-2 ' color='darkGrey' />
        <Counter value={testsPositifs} label='Tests positifs' details='Nombre total de tests positifs pour recherche de SARS-COV-2 à ce jour' color='red' />
      </div>

      <style jsx>{`
        .stats {
          background-color: ${colors.lighterGrey};
        }

        .counters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          border-bottom: 1px solid ${colors.white};
        }

        .title {
          text-align: center;
          font-size: large;
          font-weight: bold;
          padding: .5em;
          margin-top: .5em;
        }
      `}</style>
    </div>
  )
}

CovidTestsCounters.propTypes = {
  testsPositifs: PropTypes.number.isRequired,
  testsRealises: PropTypes.number.isRequired
}

export default CovidTestsCounters
