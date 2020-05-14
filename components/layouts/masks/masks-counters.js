import React, {useContext} from 'react'
import {sumBy} from 'lodash'

import Counter from '../../counter'
import colors from '../../../styles/colors'

import {MasksContext} from '.'

const MasksCounters = () => {
  const {masksCommunes} = useContext(MasksContext)
  const companiesNb = sumBy(masksCommunes, ({companies}) => companies.length)

  return (
    <div>
      <div>
        <div className='counters'>
          <Counter
            value={43000000}
            label='livraisons hebdomadaires de masques grand public'
            color='darkBlue'
          />
          <Counter
            value={companiesNb}
            label='entreprises productrices'
            color='darkBlue'
            details='Nombre d’entreprises productrices de masques'
          />
        </div>
        <h3>Prototypes</h3>
        <div className='counters'>
          <Counter
            value={1815}
            label='protoypes testés'
            color='darkBlue'
          />
          <Counter
            value={1207}
            label='prototypes testés comme répondant aux spécifications de l’État'
            color='darkBlue'
          />
          <Counter
            value={430}
            label='proposition protoypes testés'
            color='darkBlue'
            details='Nombre d’entreprises ayant proposé des prototypes testés comme répondant aux spécifications de l’Etat'
          />
        </div>
      </div>
      <style jsx>{`
        h3 {
          text-align: center;
        }

        .counters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          border-bottom: 1px solid ${colors.white};
        }
      `}</style>
    </div>
  )
}

export default MasksCounters
