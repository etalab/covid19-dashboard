import React from 'react'

import colors from '../styles/colors'

const Informations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>
      L’information officielle sur la progression de l’épidémie en France est consolidée par <a target='_top' href='https://www.santepubliquefrance.fr'>Santé publique France</a>. L’agence propose un <a target='_top' href='https://www.santepubliquefrance.fr/maladies-et-traumatismes/maladies-et-infections-respiratoires/infection-a-coronavirus/articles/infection-au-nouveau-coronavirus-sars-cov-2-covid-19-france-et-monde'>point épidémiologique quotidien</a>, qui comprend les chiffres-clés nationaux et le nombre de cas confirmés par région. Elle propose également des <a target='_top' href='https://www.data.gouv.fr/fr/organizations/sante-publique-france/'>données relatives à l’épidémie plus précises</a> sur la plateforme www.data.gouv.fr.
    </p>
    <p>
      Par ailleurs, les agences régionales de santé et les préfectures publient des bulletins d’informations centrés sur leur territoire de compétence.
    </p>
    <p>
      Cet outil <a target='_top' href='https://github.com/opencovid19-fr/dashboard'>dont le code source est libre</a>, développé sous l’impulsion d’<a target='_top' href='https://www.etalab.gouv.fr'>Etalab</a>, département de la <a target='_top' href='https://www.numerique.gouv.fr/dinum/'>direction interministérielle du numérique</a>, propose une vision consolidée des données officielles disponibles.
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
      }
    `}</style>
  </div>
))

export default Informations
