import React from 'react'
import PropTypes from 'prop-types'
import {X} from 'react-feather'

import MixedChart from '../charts/mixed-chart'

const Sumup = ({nom, casConfirmes, deces, data, onClose}) => {
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

      <MixedChart data={data} height={240} />

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
  data: PropTypes.array.isRequired,
  onClose: PropTypes.func
}

export default Sumup
