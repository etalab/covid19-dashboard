import React, {useContext} from 'react'

import Counter from '../../counter'

import {SyntheseContext} from '.'

const SyntheseStatistics = () => {
  const {synthese} = useContext(SyntheseContext)

  return (
    <div className='statistics-container'>
      <Counter
        value={synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'vert')).length}
        label='Départements où l’activité du virus est limitée'
        color='green'
        isBig
      />
      <Counter
        value={synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'orange')).length}
        label='Départements où l’activité du virus est importante'
        color='orange'
        isBig
      />
      <Counter
        value={synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'rouge')).length}
        label='Départements où l’activité du virus est élevée'
        color='red'
        isBig
      />
    </div>
  )
}

export default SyntheseStatistics
