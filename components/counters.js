import React from 'react'
import PropTypes from 'prop-types'

import Counter from './counter'

const Counters = ({report, previousReport}) => {
  const {casConfirmes, hospitalises, reanimation, deces, decesEhpad, gueris} = report || {}
  const details = {
    casConfirmes: 'Nombre cumulé de cas de COVID-19 confirmés par un test positif. <br />Un nouvel indicateur sera bientôt proposé.',
    gueris: 'Nombre cumulé de patients ayant été hospitalisés pour COVID-19 <br />et de retour à domicile en raison de l’amélioration de leur état de santé',
    deces: 'Nombre cumulé de décès de patients hospitalisés pour COVID-19 depuis le 1er mars 2020',
    hospitalises: 'Nombre de patients actuellement hospitalisés pour COVID-19',
    reanimation: ' Nombre de patients actuellement en réanimation ou soins intensifs',
    decesEhpad: 'Nombre cumulé de décès en EHPAD et EMS (établissements médico-sociaux)'
  }

  return (
    <div className='stats'>
      <Counter value={gueris} previousValue={previousReport.gueris} label='retours à domicile' details={details.gueris} color='green' />

      <div className='counters'>
        <Counter value={hospitalises} previousValue={previousReport.hospitalises} label='hospitalisations' details={details.hospitalises} color='darkGrey' />
        <Counter value={reanimation} previousValue={previousReport.reanimation} label='en réanimation' details={details.reanimation} color='darkerGrey' />
      </div>
      {decesEhpad ? <div className='counters'>
        <Counter value={deces} previousValue={previousReport.deces} label='décès à l’hôpital' details={details.deces} color='red' />
        <Counter value={decesEhpad} previousValue={previousReport.decesEhpad} label='décès en EHPAD et EMS' details={details.decesEhpad} color='darkRed' />
      </div> : <Counter value={deces} previousValue={previousReport.deces} label='décès à l’hôpital' details={details.deces} color='red' />}

      {casConfirmes && <Counter value={casConfirmes} previousValue={previousReport.casConfirmes} label='cas confirmés' details={details.casConfirmes} color='orange' />}
      <style jsx>{`
        .counters {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
