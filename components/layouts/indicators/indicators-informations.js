import React from 'react'

import colors from '../../../styles/colors'

export default () => (
  <div className='informations'>
    <p>
      <b>Point d’attention :</b> Depuis le 8 décembre, en plus des résultats des tests virologiques, ceux des tests antigéniques entrent dans la production des indicateurs épidémiologiques nationaux et territoriaux (taux d’incidence, taux de positivité et taux de dépistage). Par ailleurs, avec la prolongation de l’épidémie dans le temps et l’augmentation des capacités de dépistage, un nombre croissant de personnes peuvent faire plusieurs fois des tests qui s’avèrent négatifs sans que ceux-ci ne soient comptabilisés. Santé publique France a donc ajusté sa méthode de comptabilisation de ces patients afin que les indicateurs reflètent au mieux, notamment, la proportion de personnes infectées dans la population testée. Ces évolutions n’ont pas d’impact sur les tendances constatées et l’interprétation de la dynamique de l’épidémie.
    </p>
    <h3>Informations</h3>
    <p>
      Les données officielles sur la progression de l’épidémie en France sont consolidées par le Ministère des Solidarités et de la Santé et <a target='_top' href='https://www.santepubliquefrance.fr'>Santé publique France</a>. L’ensemble des données publiées sur ce tableau de bord peut être téléchargées sur la plateforme des données publiques <a href='https://www.data.gouv.fr'>www.data.gouv.fr</a>.
    </p>
    <p>
      Pour le taux d’incidence, le R effectif et le taux de positivité, les indicateurs sont publiés avec quelques jours de décalage, le temps que les tests RT-PCR soient analysés et les résultats centralisés.

    </p>
    <p>
      Cet outil, <a target='_top' href='https://github.com/etalab/covid19-dashboard'>dont le code source est libre</a>, est développé sous l’impulsion d’<a target='_top' href='https://www.etalab.gouv.fr'>Etalab</a>, au sein de la direction interministérielle du numérique.
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
)
