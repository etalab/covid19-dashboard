import React from 'react'
import PropTypes from 'prop-types'

import colors from '../../styles/colors'
import {ArrowRight} from 'react-feather'

const TransfertPopup = ({data}) => {
  const {patients, start, end, way} = data
  const depart = data.from.name
  const arrivee = data.to.name
  const formatDate = isoString => {
    const date = new Date(isoString)
    return date.toLocaleDateString()
  }

  const startDate = formatDate(start)
  const endDate = formatDate(end)

  return (
    <div className='sumup-container'>
      <div className='title'>{start === end ? 'Le' : 'Du'} {startDate} {start !== end && ' au ' + endDate}</div>
      <div className='text'>{patients} patients transférés </div>
      <div><span className='red'>{depart}</span> <ArrowRight style={{verticalAlign: 'sub'}} /> <span className='blue'>{arrivee}</span></div>
      <div className='footer'>Moyen de transport : <span>{Array.isArray(way) ? way.join(', ') : way}</span></div>
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

TransfertPopup.propTypes = {
  data: PropTypes.object.isRequired
}

export default TransfertPopup
