import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '../../../styles/colors'

import Counter from '../../counter'

import {BigPictureContext} from '.'

const Counters = props => {
  const {casConfirmes, cumulPremieresInjections, deces, decesEhpad} = props.report || {}
  const {selectedStat, setSelectedStat} = useContext(BigPictureContext)

  const totalDeces = (deces || 0) + (decesEhpad || 0)
  const previousReport = props.previousReport || {}
  const previousTotalDeces = previousReport.deces && previousReport.decesEhpad && deces && decesEhpad ? (previousReport.deces || 0) + (previousReport.decesEhpad || 0) : null

  const details = {
    casConfirmes: 'Nombre de cas confirmés par un test positif RT-PCR ou par un test positif antigénique. Les données peuvent être très variables en fonction des activités de dépistage (diminution des activités le week-end par exemple) et des délais de rendu des résultats.',
    gueris: 'Nombre cumulé de patients ayant été hospitalisés pour COVID-19 <br />et de retour à domicile en raison de l’amélioration de leur état de santé',
    hospitalises: 'Nombre de patients atteints de COVID-19 actuellement hospitalisés.',
    nouvellesHospitalisations: 'Nombre de nouveaux patients atteints de COVID-19 hospitalisés au cours des dernières 24h.',
    reanimation: 'Nombre de patients atteints de COVID-19 actuellement en réanimation, en soins intensifs, ou en unité de surveillance continue.',
    nouvellesReanimations: 'Nombre de nouveaux patients atteints de COVID-19 admis en réanimation, en soins intensifs, ou en unité de surveillance continue au cours des dernières 24h.',
    decesEhpad: 'Nombre cumulé de décès en EHPAD et EMS (établissements médico-sociaux)',
    casConfirmesEhpad: 'Nombre de cas confirmés par test PCR en EHPAD et EMS.<br />Ce chiffre est inclus dans le nombre total de cas confirmés.',
    cumulPremieresInjections: 'Nombre total de premières doses de vaccin injectées (données à J-1 ou J-2)'
  }

  const hospitalCountersList = [
    {
      name: 'hospitalises',
      label: 'patients hospitalisés',
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
      label: 'patients en réanimation',
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
        />}
        {cumulPremieresInjections && <Counter
          isSelected={selectedStat === 'cumulPremieresInjections'}
          onClick={() => handleClick('cumulPremieresInjections')}
          value={cumulPremieresInjections}
          previousValue={previousReport.cumulPremieresInjections}
          label='premières doses injectées (au total)'
          details={details.cumulPremieresInjections}
          color='green'
        />}
        {decesEhpad && <Counter
          isSelected={selectedStat === 'deces'}
          onClick={() => handleClick('deces')}
          value={totalDeces}
          previousValue={previousTotalDeces}
          label='cumul des décès'
          color='red'
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

Counters.defaultProps = {
  report: {},
  previousReport: {}
}

Counters.propTypes = {
  report: PropTypes.object,
  previousReport: PropTypes.object
}

export default Counters
