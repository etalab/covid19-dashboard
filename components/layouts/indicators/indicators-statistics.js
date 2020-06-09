import React, {useContext, useState, useEffect} from 'react'
import {BarChart2} from 'react-feather'

import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import {getPreviousReport, getReport} from '../../../lib/data'

import Counter from '../../counter'
import IndicateurVariationChart from '../../charts/indicateur-variation'

import {IndicatorsContext} from '.'

const INDICATORS = {
  tauxIncidence: 'Taux d’incidence',
  tauxReproductionEffectif: 'Taux de reproduction effectif',
  tauxOccupationRea: 'Taux d’occupation des lits en réa/SI/SC par des patients COVID par rapport à la capacité initiale en réa',
  tauxPositiviteTests: 'Taux de positivité des tests RT-PCR'
}

const IndicatorsStatistics = () => {
  const {date, selectedLocation, setSelectedLocation, isMobileDevice} = useContext(AppContext)

  const [report, setReport] = useState(null)
  const [previousReport, setPreviousReport] = useState(null)

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

  const {selectedIndicator, setSelectedIndicator} = useContext(IndicatorsContext)

  return (
    <>
      <div className='header'>
        {selectedLocation && !isMobileDevice && (
          <div onClick={() => setSelectedLocation('FRA')} className='back'><BarChart2 /> <span>France</span></div>
        )}
        <h3>COVID-19 - {report ? report.nom : 'France'}</h3>
      </div>

      {report && (
        Object.keys(INDICATORS).map(indicator => (
          <div key={indicator}>
            <Counter
              value={report[indicator]}
              label={INDICATORS[indicator]}
              previousValue={previousReport[indicator]}
              onClick={() => setSelectedIndicator(indicator)}
              isSelected={selectedIndicator === indicator}
            />
            <IndicateurVariationChart
              label={INDICATORS[indicator]}
              metricName={indicator}
              reports={report.history.filter(r => date >= r.date)}
            />
          </div>
        ))
      )}

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

        .chart-container {
          margin: ${isMobileDevice ? '0 0.2em' : '0 1em'};
        }

        .toggle {
          padding: 2px 20px;
          text-align: right;
          font-size: 0.8em;
          cursor: pointer;
        }
        `}</style>
    </>
  )
}

export default IndicatorsStatistics
