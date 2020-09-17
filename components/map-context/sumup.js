import React from 'react'
import PropTypes from 'prop-types'

const SumUp = ({nom, children}) => {
  return (
    <div className='sumup-container'>
      <div className='title'>{nom}</div>

      {children && (
        <div>{children}</div>
      )}

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

SumUp.defaultProps = {
  children: null
}

SumUp.propTypes = {
  nom: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default SumUp
