import React from 'react'
import PropTypes from 'prop-types'

import Counter from './counter'

const Counters = ({report, previousReport}) => {
  const {casConfirmes, hospitalises, reanimation, deces, gueris} = report || {}
  const details = {
    casConfirmes: 'Nombre cumulé de cas de COVID-19 confirmés par un test positif. <br />Ce chiffre est bien en deça du nombre probable de cas de COVID-19<br /> puisque la stratégie sanitaire actuelle est de ne tester que les cas les plus inquiétants.<br /> Un nouvel indicateur plus pertinent sera bientôt proposé.',
    gueris: 'Nombre cumulé de personnes ayant été hospitalisées <br />et de retour à domicile en raison de l’amélioration de leur état de santé',
    deces: 'Nombre cumulé de personnes décédées à l’hôpital',
    hospitalises: 'Nombre de personnes actuellement hospitalisées',
    reanimation: ' Nombre de personnes actuellement en réanimation ou soins intensifs'
  }

  return (
    <div className='stats'>
      <div className='counters'>
        <Counter value={gueris} previousValue={previousReport.gueris} label='retours à domicile' details={details.gueris} color='green' />
        <Counter value={deces} previousValue={previousReport.deces} label='décès à l’hôpital' details={details.deces} color='red' />
        <Counter value={hospitalises} previousValue={previousReport.hospitalises} label='hospitalisations' details={details.hospitalises} color='darkGrey' />
        <Counter value={reanimation} previousValue={previousReport.reanimation} label='en réanimation' details={details.reanimation} color='darkerGrey' />
      </div>
      <Counter value={casConfirmes} previousValue={previousReport.casConfirmes} label='cas confirmés' details={details.casConfirmes} color='orange' />
      <style jsx>{`
        .counters {
          background-color: whitesmoke;
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
