import React from 'react'

import colors from '../../../styles/colors'

const VaccinationsInformations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>
      Les données officielles sur la progression de l’épidémie en France sont consolidées par le Ministère des Solidarités et de la Santé et <a target='_top' href='https://www.santepubliquefrance.fr'>Santé publique France</a>. L’ensemble des données publiées sur ce tableau de bord peut être téléchargées sur la plateforme des données publiques <a href='https://www.data.gouv.fr'>www.data.gouv.fr</a>.
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
))

export default VaccinationsInformations
