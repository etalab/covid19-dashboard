import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '../../../styles/colors'

import {indicatorsList} from '../../../lib/indicators'
import {IndicatorsContext} from '.'

export const Indicator = ({label, value, color}) => {
  return (
    <div className='indicator'>
      <div>{label}:</div>
      <div className={color}>
        <span>{value && !isNaN(value) ? (
          <><b>{value.slice(0, 4)}</b> ({color})</>
        ) : (
          <b>Non renseigné</b>
        )}</span>
      </div>
      <style jsx>{`
        .rouge {
          color: ${colors.red};
        }

        .orange {
          color: ${colors.orange};
        }

        .vert {
          color: ${colors.green};
        }

        .indicator {
          display: flex;
        }

        .indicator b {
          margin-left: 0.4em;
        }

        @media (max-width: 400px) {
          .indicator {
            justify-content: space-between;
          }

          .indicator > div {
            text-align: right;
          }
        }
      `}</style>
    </div>
  )
}

Indicator.defaultProps = {
  value: null,
  color: null
}

Indicator.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  color: PropTypes.string
}

const IndicatorsDepartement = ({code, allIndicators = true}) => {
  const {selectedStat, indicators} = useContext(IndicatorsContext)

  if (indicators.length === 0 || !code) {
    return null
  }

  const departement = indicators.find(dep => dep.code === code)
  const {
    tauxIncidence,
    tauxIncidenceColor,
    tauxReproductionEffectif,
    tauxReproductionEffectifColor,
    tauxOccupationRea,
    tauxOccupationReaColor,
    tauxPositiviteTests,
    tauxPositiviteTestsColor
  } = departement

  return (
    <div className='indicators'>
      {allIndicators ? (
        <>
          <Indicator label='Taux d’incidence' value={tauxIncidence} color={tauxIncidenceColor} />
          <Indicator label='Taux de reproduction effectif' value={tauxReproductionEffectif} color={tauxReproductionEffectifColor} />
          <Indicator label='Taux d’occupation des lits en réa' value={tauxOccupationRea} color={tauxOccupationReaColor} />
          <Indicator label='Taux de positivité des tests RT-PCR' value={tauxPositiviteTests} color={tauxPositiviteTestsColor} />
        </>
      ) : (
        <Indicator label={indicatorsList[selectedStat].label} value={departement[selectedStat]} color={departement[`${selectedStat}Color`]} />
      )}
      <style jsx>{`
        .indicators {
          font-size: medium;
          margin: 0.5em 0;
        }
        `}</style>
    </div>

  )
}

IndicatorsDepartement.defaultProps = {
  code: null,
  allIndicators: true
}

IndicatorsDepartement.propTypes = {
  code: PropTypes.string,
  allIndicators: PropTypes.bool
}

export default IndicatorsDepartement
