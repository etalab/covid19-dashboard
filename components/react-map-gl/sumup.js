import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {X} from 'react-feather'

import {ThemeContext} from '../../pages'

const Sumup = ({nom, casConfirmes, deces, onClose}) => {
  const theme = useContext(ThemeContext)
  return (
    <div className='sumup-container'>
      <div className='header'>
        <div className='title'>{nom}</div>
        {onClose && (
          <div onClick={onClose}><X style={{verticalAlign: 'middle'}} /></div>
        )}
      </div>
      <div>
        {casConfirmes} cas confirmés
        {deces && deces > 0 ? <span> (dont {deces} décès)</span> : null}
      </div>

      {!onClose && (
        <div className='footer'>Cliquer pour plus d’informations</div>
      )}

      <style jsx>{`
      .sumup-container {
        font-size: larger;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .title {
        font-weight: bold;
      }

      .footer {
        font-size: small;
        font-style: italic;
        margin: 5px -10px -15px -10px;
        background-color: ${theme.primary};
        color: #fff;
        padding: 0.4em;
      }
    `}</style>
    </div>
  )
}

Sumup.defaultProps = {
  deces: null,
  onClose: null
}

Sumup.propTypes = {
  nom: PropTypes.string.isRequired,
  casConfirmes: PropTypes.number.isRequired,
  deces: PropTypes.number,
  onClose: PropTypes.func
}

export default Sumup
