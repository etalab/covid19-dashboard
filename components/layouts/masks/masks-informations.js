import React from 'react'

import colors from '../../../styles/colors'

const MasksInformations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>
      À noter que l’ensemble des entreprises productrices ne figurent pas dans cette liste.
    </p>
    <p>
      Le processus détaillé de validation des masques, est disponible sur la <a target='_top' href='https://www.gouvernement.fr/filiere-francaise-de-masques-les-entreprises-mobilisees'>page du Gouvernement relative aux entreprises mobilisées</a>.
    </p>
    <p>
      Les entreprises souhaitant connaître le processus pour faire valider leurs masques, peuvent se rendre sur la <a target='_top' href='https://www.entreprises.gouv.fr/covid-19/entreprises-comment-faire-tester-masques'>page de la Direction Générale des Entreprises</a>.
    </p>
    <style jsx>{`
      .informations {
        padding: 1em;
        background-color: ${colors.sand};
      }

      .informations p {
        font-size: 14px;
        line-height: 22px;
        text-align: justify;
      }
    `}</style>
  </div>
))

export default MasksInformations
