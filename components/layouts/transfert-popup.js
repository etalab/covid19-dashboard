import React from 'react'
import PropTypes from 'prop-types'

const TransfertPopup = ({data}) => {
  const {patients, start, end, way} = data
  const depart = data.from.name
  const arrivee = data.to.name
  const formatDate = isoString => {
    const date = new Date(isoString)
    return date.toLocaleDateString()
  }

  return (
    <div className='sumup-container'>
      <div className='title'>Départ : {depart} ({formatDate(start)})</div>
      <div className='title'>Arrivée : {arrivee} ({formatDate(end)})</div>
      <div className='footer'>Moyen de transport : {Array.isArray(way) ? way.map(item => (item + ' ')) : way}</div>
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
  data: PropTypes.object.isRequired
}

export default TransfertPopup
