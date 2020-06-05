import React from 'react'

import colors from '../../../styles/colors'

const MasksInformations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>
      Les masques approvisionnés par l’Etat sont destinés :
    </p>
    <ul>
      <li>
        <b>aux professionnels des secteurs sanitaires et médico-sociaux</b> exposés à la maladie COVID-19
      </li>
      <li>
        <b>aux malades, aux personnes contacts et aux personnes à très haut risque médical</b>
      </li>
    </ul>
    <p>
      Ils sont distribués :
    </p>
    <ul>
      <li>
        <b>via les groupements hospitaliers de territoire</b> (GHT) pour les 14 000 établissements de santé, EHPAD et établissements de la sphère médico-sociale implantés sur leur zone de responsabilité, ainsi que les services à domicile et les transporteurs sanitaires ;
      </li>
      <li>
        <b>via les 21 000 pharmacies</b> pour les professionnels de santé du secteur libéral (médecins, infirmiers, sages-femmes, kinésithérapeutes, etc.) et assimilés (aides à domicile), ainsi que les malades, personnes contacts et les personnes à très haut risque médical
      </li>
    </ul>
    <style jsx>{`
      .informations {
        padding: 1em;
        background-color: ${colors.sand};
      }

      .informations ul {
        font-size: 14px;
        line-height: 22px;
        text-align: justify;
      }
    `}</style>
  </div>
))

export default MasksInformations
