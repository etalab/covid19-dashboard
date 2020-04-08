import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'

import colors from '../styles/colors'

import Counter from './counter'

import MixedChart from './charts/mixed-chart'
import ConfirmesChart from './charts/confirmes-chart'
import DecesChart from './charts/deces-chart'
import ReanimationChart from './charts/reanimation-chart'
import HospitalisesChart from './charts/hospitalises-chart'
import GuerisChart from './charts/gueris-chart'
import {AppContext} from '../pages'

const charts = {
  mixed: {
    name: 'Tout afficher',
    chart: MixedChart
  },
  confirmed: {
    name: 'Cas confirmés',
    chart: ConfirmesChart
  },
  hospitalises: {
    name: 'Hospitalisations',
    chart: HospitalisesChart
  },
  reanimation: {
    name: 'Réanimations',
    chart: ReanimationChart
  },
  deces: {
    name: 'Décès à l’hôpital',
    chart: DecesChart
  },
  gueris: {
    name: 'Retours à domicile',
    chart: GuerisChart
  }
}

const Counters = ({report, previousReport, date}) => {
  const {selectedData, setSelectedData} = useContext(AppContext)
  const {casConfirmes, hospitalises, reanimation, deces, decesEhpad, gueris} = report || {}
  const details = {
    casConfirmes: 'Nombre cumulé de cas de COVID-19 confirmés par un test positif. <br />Un nouvel indicateur sera bientôt proposé.',
    gueris: 'Nombre cumulé de patients ayant été hospitalisés pour COVID-19 <br />et de retour à domicile en raison de l’amélioration de leur état de santé',
    deces: 'Nombre cumulé de décès de patients hospitalisés pour COVID-19 depuis le 1er mars 2020',
    hospitalises: 'Nombre de patients actuellement hospitalisés pour COVID-19',
    reanimation: ' Nombre de patients actuellement en réanimation ou soins intensifs',
    decesEhpad: 'Nombre cumulé de décès en EHPAD et EMS (établissements médico-sociaux)'
  }

  const [selectedChart, setSelectedChart] = useState('mixed')
  const Chart = charts[selectedChart].chart

  const handleSelectCounter = dataName => {
    setSelectedData(dataName === selectedData ? null : dataName)
  }

  useEffect(() => {
    setSelectedChart(selectedData || 'mixed')
  }, [selectedData])

  return (
    <>
      <div className='stats'>
        <div className='counters'>
          <Counter
            value={gueris}
            previousValue={previousReport.gueris}
            label='retours à domicile'
            details={details.gueris}
            color={colors.gueris}
            isSelected={selectedChart === 'gueris'}
            onClick={() => handleSelectCounter('gueris')}
          />
          <Counter
            value={hospitalises}
            previousValue={previousReport.hospitalises}
            label='hospitalisations'
            details={details.hospitalises}
            color={colors.hospitalises}
            isSelected={selectedChart === 'hospitalises'}
            onClick={() => handleSelectCounter('hospitalises')}
          />
          <Counter
            value={reanimation}
            previousValue={previousReport.reanimation}
            label='en réanimation'
            details={details.reanimation}
            color={colors.reanimation}
            isSelected={selectedChart === 'reanimation'}
            onClick={() => handleSelectCounter('reanimation')}
          />

        </div>
        {decesEhpad ? (
          <div className='counters'>
            <Counter
              value={deces}
              previousValue={previousReport.deces}
              label='décès à l’hôpital'
              details={details.deces}
              color={colors.deces}
              isSelected={selectedChart === 'deces'}
              onClick={() => handleSelectCounter('deces')}
            />
            <Counter
              value={decesEhpad}
              previousValue={previousReport.decesEhpad}
              label='décès en EHPAD et EMS'
              details={details.decesEhpad}
              color={colors.decesEhpad}
            />
          </div>
        ) : (
          <Counter
            value={deces}
            previousValue={previousReport.deces}
            label='décès à l’hôpital'
            details={details.deces}
            color={colors.deces}
            isSelected={selectedChart === 'deces'}
            onClick={() => handleSelectCounter('deces')}
          />
        )}
        {casConfirmes && (
          <Counter
            value={casConfirmes}
            previousValue={previousReport.casConfirmes}
            label='cas confirmés'
            details={details.casConfirmes}
            color={colors.casConfirmes}
            isSelected={selectedChart === 'confirmed'}
            onClick={() => handleSelectCounter('confirmed')}
          />
        )}
      </div>
      {report && report.history && (
        <Chart data={report.history.filter(r => date >= r.date)} />
      )}
      <style jsx>{`
        .counters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        }
      `}</style>
    </>
  )
}

Counters.defaultProps = {
  report: {},
  previousReport: {}
}

Counters.propTypes = {
  report: PropTypes.object,
  previousReport: PropTypes.object,
  date: PropTypes.string.isRequired
}

export default Counters
