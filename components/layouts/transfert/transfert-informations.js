import React from 'react'

import colors from '../../../styles/colors'

const TransfertInformations = React.memo(() => (
  <div className='informations'>
    <h3>Informations</h3>
    <p>
      Données concernant les patients transférés d’une région française à une autre autre, ou vers un autre pays européen.
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

export default TransfertInformations
