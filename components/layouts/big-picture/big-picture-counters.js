import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '../../../styles/colors'

import Counter from '../../counter'

import {BigPictureContext} from '.'

const Counters = props => {
  const {casConfirmes, deces, decesEhpad} = props.report || {}
  const {selectedStat, setSelectedStat} = useContext(BigPictureContext)

  const totalDeces = (deces || 0) + (decesEhpad || 0)
  const previousReport = props.previousReport || {}
  const previousTotalDeces = (previousReport.deces || 0) + (previousReport.decesEhpad || 0)

  const details = {
    casConfirmes: 'Nombre cumulé de cas de COVID-19 confirmés par un test positif. <br />',
    gueris: 'Nombre cumulé de patients ayant été hospitalisés pour COVID-19 <br />et de retour à domicile en raison de l’amélioration de leur état de santé',
    deces: 'Nombre cumulé de décès de patients hospitalisés pour COVID-19 depuis le 1er mars 2020',
    hospitalises: 'Nombre de patients actuellement hospitalisés pour COVID-19',
    nouvellesHospitalisations: 'Nombre de nouveaux patients hospitalisés au cours des dernières 24h',
    reanimation: ' Nombre de patients actuellement en réanimation ou soins intensifs',
    nouvellesReanimations: 'Nombre de nouveaux patients admis en réanimation au cours des dernières 24h',
    decesEhpad: 'Nombre cumulé de décès en EHPAD et EMS (établissements médico-sociaux)',
    casConfirmesEhpad: 'Nombre de cas confirmés par test PCR en EHPAD et EMS.<br />Ce chiffre est inclus dans le nombre total de cas confirmés.',
    casEhpad: 'Nombre total de cas en EHPAD et EMS'
  }

  const hospitalCountersList = [
    {
      name: 'hospitalises',
      label: 'hospitalisations',
      color: 'darkGrey'
    },
    {
      name: 'nouvellesHospitalisations',
      label: 'nouveaux patients hospitalisés',
      color: 'darkGrey'
    },
    {
      name: 'gueris',
      label: 'retours à domicile',
      color: 'green'
    },
    {
      name: 'reanimation',
      label: 'en réanimation',
      color: 'darkerGrey'
    },
    {
      name: 'nouvellesReanimations',
      label: 'nouveaux patients en réanimation',
      color: 'darkerGrey'
    },
    {
      name: 'deces',
      label: 'décès à l’hôpital',
      color: 'red'
    }
  ]

  const ehpadCountersList = [
    {
      name: 'casEhpad',
      label: 'cas total en EHPAD et EMS',
      color: 'orange'
    },
    {
      name: 'casConfirmesEhpad',
      label: 'cas confirmés en EHPAD et EMS',
      color: 'darkOrange'
    },
    {
      name: 'decesEhpad',
      label: 'décès en EHPAD et EMS',
      color: 'darkRed'
    }
  ]

  const handleClick = chartName => {
    setSelectedStat(chartName === selectedStat ? 'mixed' : chartName)
  }

  return (
    <div className='stats'>
      <div className='counters'>
        {casConfirmes && <Counter
          isSelected={selectedStat === 'confirmed'}
          onClick={() => handleClick('confirmed')}
          value={casConfirmes}
          previousValue={previousReport.casConfirmes}
          label='cas confirmés'
          details={details.casConfirmes}
          color='orange'
          isBig
        />}
        {decesEhpad && <Counter
          isSelected={selectedStat === 'deces'}
          onClick={() => handleClick('deces')}
          value={totalDeces}
          previousValue={previousTotalDeces}
          label='cumul des décès'
          details='Cumul des décés'
          color='red'
          isBig
        />}
      </div>
      <div className='title'>Données hospitalières</div>
      <div className='counters'>
        {hospitalCountersList.map(counter => (
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
      <div className='title'>Données EHPAD et EMS</div>
      {decesEhpad &&
      <div className='counters'>
        {ehpadCountersList.map(counter => (
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
      </div>}

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

Counters.defaultProps = {
  report: {},
  previousReport: {}
}

Counters.propTypes = {
  report: PropTypes.object,
  previousReport: PropTypes.object
}

export default Counters
