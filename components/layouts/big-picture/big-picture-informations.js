import React from 'react'

import colors from '../../../styles/colors'

const BigPictureInformations = React.memo(() => (
  <div className='informations'>
    <p>
      Les difficultés de remontée des résultats de tests vers Santé publique France ont été progressivement résolues entre le 5 et le 7 novembre. À ce jour, l’ensemble des résultats sont disponibles selon les délais de consolidation habituels.
    </p>
    <h3>Informations</h3>
    <p>
      L’information officielle sur la progression de l’épidémie en France est consolidée par <a target='_top' href='https://www.santepubliquefrance.fr'>Santé publique France</a>. L’agence propose un <a target='_top' href='https://www.santepubliquefrance.fr/maladies-et-traumatismes/maladies-et-infections-respiratoires/infection-a-coronavirus/articles/infection-au-nouveau-coronavirus-sars-cov-2-covid-19-france-et-monde'>point épidémiologique quotidien</a>, qui comprend les chiffres-clés nationaux. Elle propose également des <a target='_top' href='https://www.data.gouv.fr/fr/organizations/sante-publique-france/'>données relatives à l’épidémie plus précises</a> sur la plateforme <a target='_top' href='https://www.data.gouv.fr'>www.data.gouv.fr</a>.
    </p>
    <p>
      Cet outil <a target='_top' href='https://github.com/etalab/covid19-dashboard'>dont le code source est libre</a>, développé sous l’impulsion d’<a target='_top' href='https://www.etalab.gouv.fr'>Etalab</a>, au sein de la <a target='_top' href='https://www.numerique.gouv.fr/dinum/'>direction interministérielle du numérique</a>, propose une vision consolidée des données officielles disponibles.
    </p>
    <p>Pour obtenir d’autres informations relatives à l’épidémie, il est possible de consulter <a target='_top' href='https://www.gouvernement.fr/info-coronavirus'>la page d’information du Gouvernement sur le COVID-19</a>.</p>

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

export default BigPictureInformations
