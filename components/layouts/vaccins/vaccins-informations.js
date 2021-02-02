import React from 'react'

import colors from '../../../styles/colors'

const VaccinsInformations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>

    <h4>Précision concernant les stocks de vaccins</h4>

    <p>Compte-tenu des conditions de conservation de doses Pfizer, deux flux ont été créés :</p>

    <ul>
      <li>Le flux A correspond aux doses transportées vers une des 6 plateformes de stockage Santé Publique France. En fonction des demandes remontées, les doses sont ensuite transportées vers les officines rattachées aux EHPAD puis livrées aux EHPAD.</li>
      <li>Le flux B correspond aux doses transportées toutes les semaines vers une centaine d’établissements de santé publics. Ces doses sont ensuite livrées dans les centres de vaccination, dans les EHPAD rattachés au flux B par l’ARS et dans les FAM et MAS. Les établissements de santé pivots sont également des centres de vaccination, ils conservent donc une partie des doses pour pouvoir vacciner.</li>
    </ul>

    <p>En raison du faible nombre de doses Moderna reçues à date, ces vaccins ont été livrés en priorité à des établissements de santé situés dans des régions à forte circulation épidémique. Les doses stockées dans les établissements pivots sont livrées dans les centres de vaccination.</p>

    <p>Ces données sont publiées et accessibles sur la plateforme <a href='https://www.data.gouv.fr'>www.data.gouv.fr</a>.</p>

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

export default VaccinsInformations
