import React from 'react'

import colors from '../../../styles/colors'

const SyntheseInformations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>Le suivi de l’activité épidémique repose sur les 2 indicateurs suivants :</p>
    <ul>
      <li><b>la circulation du virus</b>, basée sur la proportion de passages aux urgences pour une suspicion de COVID-19</li>
      <li><b>la tension sur les capacités en réanimation</b>, basée sur les taux d’occupation des lits de réanimation par des patients atteints de COVID-19, par rapport à la capacité initiale avant l’épidémie</li>
    </ul>
    <p>Cette carte synthétise ces 2 indicateurs et sera actualisée tous les soirs, après le point presse du Pr Jérôme Salomon.</p>
    <p>Le statut de chaque département (vert/orange/rouge) est disponible sur <a href='https://www.data.gouv.fr/fr/datasets/indicateurs-dactivite-epidemique-covid-19-par-departement/' target='_top'>www.data.gouv.fr</a>.</p>

    <style jsx>{`
      .informations {
        padding: 1em;
        background-color: ${colors.sand};
      }

      .informations p, .informations ul {
        font-size: 14px;
        line-height: 22px;
        text-align: justify;
      }
    `}</style>
  </div>
))

export default SyntheseInformations
