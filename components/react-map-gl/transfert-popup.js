import React from 'react'
import PropTypes from 'prop-types'
import {ArrowRight} from 'react-feather'

import colors from '../../styles/colors'

import {formatDate} from '../../lib/date'

const TransfertPopup = ({debut_transfert, fin_transfert, type_vecteur, region_depart, region_arrivee, pays_arrivee, nombre_patients_transferes}) => {
  const startDate = formatDate(debut_transfert)
  const endDate = formatDate(fin_transfert)

  return (
    <div className='sumup-container'>
      <div className='title'>{debut_transfert === fin_transfert ? (
        <>Le {startDate}</>
      ) : (
        <>Du {startDate} au {endDate}</>
      )}</div>
      <div className='text'>{nombre_patients_transferes} patients transférés </div>
      <div><span className='red'>{region_depart}</span> <ArrowRight style={{verticalAlign: 'sub'}} /> <span className='blue'>{region_arrivee || 'Europe'}</span></div>
      <div className='footer'>Moyen de transport : <span>{Array.isArray(type_vecteur) ? type_vecteur.join(', ') : type_vecteur}</span></div>
      <div className='infos'>Cliquez pour plus d’informations</div>

      <style jsx>{`
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
  region_arrivee: null,
  pays_arrivee: null
}

TransfertPopup.propTypes = {
  debut_transfert: PropTypes.string.isRequired,
  fin_transfert: PropTypes.string.isRequired,
  type_vecteur: PropTypes.string.isRequired,
  region_depart: PropTypes.string.isRequired,
  region_arrivee: PropTypes.string,
  pays_arrivee: PropTypes.string,
  nombre_patients_transferes: PropTypes.string.isRequired
}

export default TransfertPopup
