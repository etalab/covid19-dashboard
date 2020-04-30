import React from 'react'

import colors from '../../../styles/colors'

const SyntheseInformations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>Les indicateurs départementaux publiés le 30 avril 2020 sont communiqués à titre indicatif pour préparer le déconfinement des populations, qui débutera le 11 mai. <b>Le confinement de l’ensemble du territoire reste en vigueur jusqu’au 11 mai.</b></p>
    <p>Pour obtenir d’autres informations relatives au déconfinement, il est  possible de consulter la page d’information du <a href='https://www.gouvernement.fr/info-coronavirus/strategie-de-deconfinement' target='_top'>site du gouvernement</a>.</p>
    <p>Les données de situation épidémiologique sont disponibles sur <a href='https://www.data.gouv.fr/fr/datasets/indicateurs-de-situation-epidemioligique-covid-19-par-departement/' target='_top'>www.data.gouv.fr</a>.</p>

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
