import React from 'react'

import colors from '../styles/colors'

const Informations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>
      L‘information officielle sur la progression de l’épidémie en France est consolidée par <a href='https://www.santepubliquefrance.fr'>Santé publique France</a>. L’agence propose un <a href='https://www.santepubliquefrance.fr/maladies-et-traumatismes/maladies-et-infections-respiratoires/infection-a-coronavirus/articles/infection-au-nouveau-coronavirus-sars-cov-2-covid-19-france-et-monde'>point épidémiologique quotidien</a>, qui comprend les chiffres-clés nationaux et le nombre de cas confirmés par région, mais aussi des <a href='https://www.data.gouv.fr/fr/organizations/sante-publique-france/'>données plus précises</a> sur le portail <a href='https://data.gouv.fr'>data.gouv.fr</a>.
    </p>
    <p>
      Les agences régionales de santé et les préfectures publient aussi des bulletins centrés sur leur territoire de compétence.
    </p>
    <p>
      Cet outil <a href='https://github.com/opencovid19-fr/dashboard'>libre</a>, développé sous l’impulsion de la <a href='https://www.numerique.gouv.fr/dinum/'>direction interministérielle du numérique</a>, propose une vision consolidée des données officielles disponibles.
    </p>
    <p>Pensez aussi à consulter la <a href='https://www.gouvernement.fr/info-coronavirus'>page d’information du Gouvernement sur le COVID-19</a>.</p>

    <style jsx>{`
      .informations {
        padding: 1em;
        background-color: ${colors.sand};
      }

      .informations p {
        font-size: 14px;
        line-height: 22px;
      }
    `}</style>
  </div>
))

export default Informations
