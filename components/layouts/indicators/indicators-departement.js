import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '../../../styles/colors'

import {IndicatorsContext} from '.'

const IndicatorsDepartement = ({code}) => {
  const {indicators} = useContext(IndicatorsContext)

  const {
    tauxIncidence,
    tauxIncidenceColor,
    tauxReproductionEffectif,
    tauxReproductionEffectifColor,
    tauxOccupationRea,
    tauxOccupationReaColor,
    tauxPositiviteTests,
    tauxPositiviteTestsColor
  } = indicators.find(indicator => indicator.code === code)

  return (
    <>
      <div className='indicators'>
        <div>Taux d’incidence: <div className={tauxIncidenceColor}><b>{tauxIncidence}</b> ({tauxIncidenceColor})</div></div>
        <div>Taux de reproduction effectif: <div className={tauxReproductionEffectifColor}><b>{tauxReproductionEffectif}</b> ({tauxReproductionEffectifColor})</div></div>
        <div>Taux d’occupation des lits en réa: <div className={tauxOccupationReaColor}><b>{tauxOccupationRea}</b> ({tauxOccupationReaColor})</div></div>
        <div>Taux de positivité des tests RT-PCR: <div className={tauxPositiviteTestsColor}><b>{tauxPositiviteTests.slice(0, 3)}</b> ({tauxPositiviteTestsColor})</div></div>
      </div>

      <style jsx>{`
        .indicators {
          font-size: medium;
          margin: 0.5em 0;
        }

        .indicators > div {
          display: flex;
        }

        .indicators b {
          margin-left: 0.4em;
        }

        .rouge {
          color: ${colors.red};
        }

        .orange {
          color: ${colors.orange};
        }

        .vert {
          color: ${colors.green};
        }

        @media (max-width: 400px) {
          .indicators > div {
            justify-content: space-between;
          }

          .indicators > div > div {
            text-align: right;
          }
        }
        `}</style>
    </>
  )
}

IndicatorsDepartement.propTypes = {
  code: PropTypes.string.isRequired
}

export default IndicatorsDepartement
