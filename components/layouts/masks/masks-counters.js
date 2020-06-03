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
      <h3>Production des masques grand public</h3>
      <div className='counters'>
        <Counter
          value={43000000}
          label='Masques grand public'
          color='darkBlue'
          details='Nombre de masques grand public livrés de manière hebdomadaire'
        />
        <Counter
          value={companiesNb}
          label='Entreprises productrices'
          color='darkBlue'
          details='Nombre d’entreprises productrices de masques'
        />
      </div>
      <h4>Prototypes</h4>
      <div className='counters'>
        <Counter
          value={1815}
          label='Protoypes testés'
          color='darkBlue'
          details='Nombre de prototypes de masque testés'
        />
        <Counter
          value={1207}
          label='Prototypes validés'
          color='darkBlue'
          details='Nombre de prototypes de masque testés comme répondant aux spécifications de l’État'
        />
        <Counter
          value={430}
          label='Entreprises avec prototypes validés'
          color='darkBlue'
          details='Nombre d’entreprises ayant proposé des prototypes testés comme répondant aux spécifications de l’Etat'
        />
      </div>
      <style jsx>{`
        h3, h4 {
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
