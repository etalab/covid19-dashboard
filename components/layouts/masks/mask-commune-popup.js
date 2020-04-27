import React from 'react'
import PropTypes from 'prop-types'

const MasksCommunePopup = ({nom, companies}) => {
  const companiesNb = companies.length
  return (
    <div className='sumup-container'>
      <div className='title'>{nom}</div>
      <div className=''><b>{companiesNb}</b> entreprise{companiesNb > 1 ? 's' : ''}</div>
      <div className='footer'>Cliquer pour plus d’informations</div>

      <style jsx>{`
      .sumup-container {
        font-size: larger;
      }

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

MasksCommunePopup.propTypes = {
  nom: PropTypes.string.isRequired,
  companies: PropTypes.array.isRequired
}

export default MasksCommunePopup
