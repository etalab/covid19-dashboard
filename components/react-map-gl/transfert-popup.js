import React from 'react'
import PropTypes from 'prop-types'

import colors from '../../styles/colors'

import {formatDate} from '../../lib/date'
import {transports} from '../../lib/transports'

const TransfertPopup = ({debutTransfert, finTransfert, typeVecteur, regionDepart, regionArrivee, nbPatientsTransferes}) => {
  const startDate = formatDate(debutTransfert)
  const endDate = formatDate(finTransfert)

  return (
    <div className='sumup-container'>
      <div className='title'>{debutTransfert === finTransfert ? (
        <>Le {startDate}</>
      ) : (
        <>Du {startDate} au {endDate}</>
      )}</div>
      <div className='text'>{nbPatientsTransferes} patients transférés </div>
      <div>
        <span className='red'>{regionDepart}</span>
        <>→</>
        <span className='blue'>{regionArrivee || 'Europe'}</span>
      </div>
      <div className='footer'>Moyen de transport :
        <span>{typeVecteur.map(type => (
          <img key={type} className='icons' src={transports[type]} alt={type} title={`Transfert effectué en ${type}`} aria-hidden='true' />
        ))}</span></div>
      <div className='infos'>Cliquez consulter le détail des transferts entre ces régions</div>

      <style jsx>{`
     .icons {
        width: 1.28571429em;
        text-align: center;
        vertical-align: bottom;
        margin: 0 .5em;
      }

      .title {
        font-weight: bold;
        text-align: center;
        padding-bottom: .3em;
      }

      .text {
        text-align: center;
        padding: .5em;
      }

      .red {
        color: ${colors.red};
        font-weight: bold;
        padding: .5em;
      }

      .blue {
        color: ${colors.blue};
        font-weight: bold;
        padding: .5em;
      }

      .infos {
        font-size: small;
        font-weight: bold;
        font-style: italic;
        padding-top: 1em;
      }

      .footer {
        font-size: small;
        font-style: italic;
        padding-top: 1.5em;
      }
    `}</style>
    </div>
  )
}

TransfertPopup.defaultProps = {
  regionArrivee: null
}

TransfertPopup.propTypes = {
  debutTransfert: PropTypes.string.isRequired,
  finTransfert: PropTypes.string.isRequired,
  typeVecteur: PropTypes.array.isRequired,
  regionDepart: PropTypes.string.isRequired,
  regionArrivee: PropTypes.string,
  nbPatientsTransferes: PropTypes.string.isRequired
}

export default TransfertPopup
