import React, {useContext, useState, useEffect, useMemo, useCallback} from 'react'
import {BarChart2} from 'react-feather'

import departements from '@etalab/decoupage-administratif/data/departements.json'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import {getPreviousReport, getReport} from '../../../lib/data'

import Counter from '../../counter'
import IndicateurChart from '../../charts/indicateurs-chart'

import IndicatorsDepartement from './indicators-departement'

import {IndicatorsContext} from '.'

const INDICATORS = {
  tauxIncidence: {
    label: 'Taux d’incidence',
    min: 1,
    max: 10
  },
  tauxReproductionEffectif: {
    label: 'Taux de reproduction effectif',
    min: 0,
    max: 1.5
  },
  tauxOccupationRea: {
    label: 'Taux d’occupation des lits en réanimation',
    details: 'Taux d’occupation des lits en réa/SI/SC par des patients COVID par rapport à la capacité initiale en réa',
    min: 40,
    max: 60
  },
  tauxPositiviteTests: {
    label: 'Taux de positivité des tests RT-PCR',
    min: 5,
    max: 10
  }
}

const IndicatorsStatistics = () => {
  const {date, selectedLocation, setSelectedLocation, isMobileDevice} = useContext(AppContext)

  const {selectedStat, setSelectedStat, indicators} = useContext(IndicatorsContext)

  const [report, setReport] = useState(null)
  const [previousReport, setPreviousReport] = useState(null)

  const [locationType, code] = selectedLocation.split('-')

  useEffect(() => {
    async function fetchReport() {
      setReport(await getReport(date, selectedLocation))
    }

    fetchReport()
  }, [date, selectedLocation])

  useEffect(() => {
    async function fetchPreviousReport() {
      setPreviousReport(await getPreviousReport(report))
    }

    if (report) {
      fetchPreviousReport()
    }
  }, [report])

  const getIndicatorValue = useCallback(indicator => {
    const indicatorValue = report[indicator]
    if (indicatorValue && !isNaN(indicatorValue) && typeof indicatorValue === 'number') {
      return parseFloat(indicatorValue.toFixed(2))
    }

    return null
  }, [report])

  const departementsRegion = useMemo(() => {
    if (locationType === 'REG') {
      return indicators.filter(indicator => {
        return departements
          .filter(d => d.region === code)
          .map(d => d.code)
          .includes(indicator.code)
      })
    }

    return []
  }, [locationType, code, indicators])

  return (
    <>
      <div className='header'>
        {selectedLocation && !isMobileDevice && (
          <div onClick={() => setSelectedLocation('FRA')} className='back'><BarChart2 /> <span>France</span></div>
        )}
        <h3>COVID-19 - {report ? report.nom : 'France'}</h3>
      </div>

      <div className='indicators-container'>
        {report && selectedLocation === 'FRA' ? (
          Object.keys(INDICATORS).map(indicator => {
            const {label, min, max} = INDICATORS[indicator]
            const value = getIndicatorValue(indicator)
            return (
              <div className={`indicators ${selectedStat === indicator ? 'selected' : ''}`} key={indicator} onClick={() => setSelectedStat(indicator)}>
                <Counter
                  value={value}
                  label={label}
                  previousValue={previousReport && previousReport[indicator]}
                  onClick={() => setSelectedStat(indicator)}
                  isSelected={selectedStat === indicator}
                />
                <IndicateurChart
                  label={label}
                  metricName={indicator}
                  min={min}
                  max={max}
                  reports={report.history.filter(r => date >= r.date)}
                />
              </div>
            )
          })
        ) : (
          locationType === 'REG' ? (
            <>
              {departementsRegion.map(r => (
                <div key={r.code}>
                  <h3>{r.nom}</h3>
                  <IndicatorsDepartement code={r.code} />
                </div>
              ))}
            </>
          ) : (
            <IndicatorsDepartement code={code} />
          )
        )}
      </div>

      <style jsx>{`
        .header {
          z-index: 2;
          text-align: center;
          position: sticky;
          top: 0;
          background-color: white;
          padding: ${isMobileDevice ? '0.2em' : 0};
          box-shadow: 0 1px 4px ${colors.lightGrey};
        }

        .header h3 {
          margin: 0.4em;
        }

        .back {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background: ${colors.lighterGrey};
          padding: 0.5em;
          font-size: larger;
        }

        .back span {
          margin: 0 0.5em;
        }

        .back:hover {
          cursor: pointer;
          background: ${colors.lightGrey};
        }

        .indicators-container {
          padding: 0.5em;
        }

        .indicators {
          border-radius: 5px;
          margin-bottom: 0.5em;
          background: ${colors.lighterGrey};
          cursor: pointer
        }

        .indicators:hover, .selected{
          background: ${colors.lightGrey};
        }
        `}</style>
    </>
  )
}

export default IndicatorsStatistics
