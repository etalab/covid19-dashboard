import React from 'react'

import colors from '../../../styles/colors'

const PrelemevementsInformations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>
      Si les délais de rendez-vous dépassent les 48 heures, n’hésitez pas à contacter plusieurs lieux de prélèvement.
    </p>
    <p>
      Les données présentées proviennent de déclarations des laboratoires et établissements de santé, auprès des Agences régionales de santé, et via une plateforme internet développée par le Ministère des Solidarités et de la Santé, sur leurs points de dépistage COVID-19. Les données sont mises à jour quotidiennement et sont disponibles sur la plateforme <a target='_top' href='https://www.data.gouv.fr/fr/'>www.data.gouv.fr</a>.
    </p>
    <p>
      <b>Point d’attention</b> : pour faire un test virologique  (RT-PCR) de dépistage du COVID-19, il est nécessaire d’avoir une  prescription.  Soit je dispose d’une ordonnance de prescription de mon médecin, soit j’ai été appelé par l’Assurance Maladie dans le cadre de  la recherche des personnes contacts. Dans ce cas, le laboratoire disposera automatiquement de la prescription. Le test sera réalisable uniquement à ces conditions.
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

export default PrelemevementsInformations
