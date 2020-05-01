import React from 'react'
import PropTypes from 'prop-types'

const SumUp = ({nom}) => {
  return (
    <div className='sumup-container'>
      <div className='title'>{nom}</div>
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

SumUp.propTypes = {
  nom: PropTypes.string.isRequired
}

export default SumUp
