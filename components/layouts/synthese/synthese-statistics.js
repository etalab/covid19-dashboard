import React, {useContext} from 'react'

import Counter from '../../counter'

import {SyntheseContext} from '.'

const SyntheseStatistics = () => {
  const {synthese} = useContext(SyntheseContext)

  return (
    <div className='statistics-container'>
      <Counter
        value={synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'vert')).length}
        label='départements classés vert'
        color='green'
        isBig
      />
      <Counter
        value={synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'orange')).length}
        label='départements classés orange'
        color='orange'
        isBig
      />
      <Counter
        value={synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'rouge')).length}
        label='départements classés rouge'
        color='red'
        isBig
      />
    </div>
  )
}

export default SyntheseStatistics
