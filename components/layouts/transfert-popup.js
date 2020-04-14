import React from 'react'
import PropTypes from 'prop-types'

const TransfertPopup = ({depart, arrivee, patients}) => {
  return (
    <div className='sumup-container'>
      <div className='title'>Départ : {depart}</div>
      <div className='title'>Arrivée : {arrivee}</div>
      <div className='footer'>{patients} patients transférés</div>

      <style jsx>{`
      .title {
        font-weight: bold;
      }

      .footer {
        font-size: small;
        font-style: italic;
        padding: 0.2em 0;
      }
    `}</style>
    </div>
  )
}

TransfertPopup.propTypes = {
  depart: PropTypes.string.isRequired,
  arrivee: PropTypes.string.isRequired,
  patients: PropTypes.number.isRequired
}

export default TransfertPopup
