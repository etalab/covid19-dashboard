import React from 'react'

import colors from '../../../styles/colors'

const TransfertInformations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>
      Pour répondre à la mise en tension du système de santé français, le gouvernement opère depuis le 18 mars 2020 des transferts de patients entre établissements hospitaliers. Ce dispositif a pour objectif de désengorger les établissements les plus touchés par l’épidémie de COVID-19.
    </p>
    <p>
      Cet outil propose une vision consolidée des transferts réalisés. Les <a href='https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-transferts-de-patients-atteints-de-covid-19/' target='_top'>données de transferts de patients</a> sont disponibles sur la plateforme www.data.gouv.fr.
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

export default TransfertInformations
