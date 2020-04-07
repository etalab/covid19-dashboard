import React, {useState} from 'react'
import PropTypes from 'prop-types'

import Counter from './counter'

import colors from '../styles/colors'

import MixedChart from './charts/mixed-chart'
import ConfirmesChart from './charts/confirmes-chart'
import DecesChart from './charts/deces-chart'
import ReanimationChart from './charts/reanimation-chart'
import HospitalisesChart from './charts/hospitalises-chart'
import GuerisChart from './charts/gueris-chart'

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

  return (
    <>
      <div className='stats'>
        <div className='counters'>
          <Counter
            value={gueris}
            previousValue={previousReport.gueris}
            label='retours à domicile'
            details={details.gueris}
            color='green'
            isSelected={selectedChart === 'gueris'}
            onClick={() => setSelectedChart('gueris')}
          />
          <Counter
            value={hospitalises}
            previousValue={previousReport.hospitalises}
            label='hospitalisations'
            details={details.hospitalises}
            color='darkGrey'
            isSelected={selectedChart === 'hospitalises'}
            onClick={() => setSelectedChart('hospitalises')}
          />
          <Counter
            value={reanimation}
            previousValue={previousReport.reanimation}
            label='en réanimation'
            details={details.reanimation}
            color='darkerGrey'
            isSelected={selectedChart === 'reanimation'}
            onClick={() => setSelectedChart('reanimation')}
          />

        </div>
        {decesEhpad ? (
          <div className='counters'>
            <Counter
              value={deces}
              previousValue={previousReport.deces}
              label='décès à l’hôpital'
              details={details.deces}
              color='red'
              isSelected={selectedChart === 'deces'}
              onClick={() => setSelectedChart('deces')}
            />
            <Counter
              value={decesEhpad}
              previousValue={previousReport.decesEhpad}
              label='décès en EHPAD et EMS'
              details={details.decesEhpad}
              color='darkRed'
            />
          </div>
        ) : (
          <Counter
            value={deces}
            previousValue={previousReport.deces}
            label='décès à l’hôpital'
            details={details.deces}
            color='red'
            isSelected={selectedChart === 'deces'}
            onClick={() => setSelectedChart('deces')}
          />
        )}
        {casConfirmes && (
          <Counter
            value={casConfirmes}
            previousValue={previousReport.casConfirmes}
            label='cas confirmés'
            details={details.casConfirmes}
            color='orange'
            isSelected={selectedChart === 'confirmed'}
            onClick={() => setSelectedChart('confirmed')}
          />
        )}
        {selectedChart !== 'mixed' && (
          <div className='button-container'>
            <div className='chart-name' onClick={() => setSelectedChart('mixed')}>Afficher tout</div>
          </div>
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

        .chart-name {
          display: block;
          font-weight: bold;
          height: 100%;
          text-align: center;
          background-color: ${colors.white};
          color: ${colors.darkBlue};
          padding: 0.4em;
          font-size: .7em;
          letter-spacing: .1em;
          border: 1px solid ${colors.darkBlue};
          text-transform: uppercase;
          transform: translate(-.1em, -.1em);
          transition: transform .1s ease-out;
        }

        .chart-name:hover {
          cursor: pointer;
          color: ${colors.white};
          background-color: ${colors.darkBlue};
          transform: translate(0px, 0px);
        }

        .button-container {
          background-color: ${colors.white};
          border-bottom: 1px solid ${colors.darkBlue};
          border-right: 1px solid ${colors.darkBlue};
          margin: 1em;
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
