import React from 'react'

import colors from '../../../styles/colors'

const TestsInformations = React.memo(() => (
  <div className='informations'>
    <p>
      Les difficultés de remontée des résultats de tests vers Santé publique France ont été progressivement résolues entre le 5 et le 7 novembre. À ce jour, l’ensemble des résultats sont disponibles selon les délais de consolidation habituels.
    </p>
    <h3>Informations</h3>
    <p>
      Jusqu’au 13 mai 2020, les données exposées sont issues des <a href='https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-tests-de-depistage-de-covid-19-realises-en-laboratoire-de-ville/' target='_top'>données de dépistages réalisés en laboratoire de ville</a>. Depuis le 13 mai 2020, les <a href='https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-resultats-des-tests-virologiques-covid-19/' target='_top'>données exposées sont issues du système SI-DEP</a>, qui permet une évaluation plus précise du suivi des tests virologiques COVID-19.
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

export default TestsInformations
