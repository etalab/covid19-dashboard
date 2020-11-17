import React from 'react'

import BigPictureInformations from '../big-picture/big-picture-informations'

const TestsInformations = React.memo(() => (
  <BigPictureInformations>
    Les données de suivi des tests sont issues du système d’information de dépistage (SI-DEP), dont l’objectif est de remonter les données de tests (RT-PCR) réalisés par l’ensemble des laboratoires de ville et établissements hospitaliers concernant le SARS-COV2. Compte-tenu du temps d’analyse des tests et de collecte des résultats, les données reflètent la situation à J-3. Elles sont généralement sous-estimées, car l’ensemble des résultats de tests à J-3 ne sont pas remontés à la date J.
  </BigPictureInformations>
))

export default TestsInformations
