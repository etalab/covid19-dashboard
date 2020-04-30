import React from 'react'

import colors from '../../../styles/colors'

const SyntheseInformations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>Attention, les indicateurs départementaux publiés le 30 avril 2020 sont communiqués à titre indicatif pour préparer le déconfinement des populations, qui débutera le 11 mai.</p>
    <p><b>Le confinement de l’ensemble du territoire reste en vigueur jusqu’au 11 mai</b>. La situation de chaque département peut évoluer de manière favorable ou défavorable.</p>
    <p>Pour obtenir d’autres informations relatives au déconfinement, il est possible de consulter <a target='_top' href='https://www.gouvernement.fr/info-coronavirus/strategie-de-deconfinement'>la page d’information du site du gouvernement</a>.</p>

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

export default SyntheseInformations
