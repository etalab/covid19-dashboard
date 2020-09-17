import React from 'react'
import PropTypes from 'prop-types'
import {MapPin} from 'react-feather'

import colors from '../../../styles/colors'

const PlaceSumup = ({name, adresse, isPublic, audience, complementAdresse, appointmentOnly}) => (
  <div className='place-container'>
    <div className='title'>{name}</div>
    <div className='address-container'>
      <div><MapPin /></div>
      <div className='address'>
        <div>{adresse}</div>
        {complementAdresse && <div className='completement'>{complementAdresse}</div>}
      </div>
    </div>

    <div className='tags'>
      {isPublic ? (
        <div className='tag'>Tout public</div>
      ) : (
        <div className='tag limited-access'>Accès limité{audience ? ` - ${audience}` : '' }</div>
      )}

      {appointmentOnly && (
        <div className='tag appointment'>Sur rendez-vous uniquement</div>
      )}
    </div>

    <style jsx>{`
      .place-container {
        max-width: 250px;
      }

      .title {
        font-size: 1.1em;
        font-weight: bold;
        margin-bottom: 0.5em;
      }

      .address-container {
        display: flex;
        align-items: center;
      }

      .address {
        margin-left: 0.5em;
        flex-direction: column;
        font-size: small;
      }

      .completement {
        font-size: x-small;
        font-style: italic;
      }

      .tags {
        display: grid;
        grid-gap: 0.2em;
      }

      .tag {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        padding: 0.2em;
        margin: 0.5em 0 -0.5em;
        color: #fff;
        background-color: ${colors.green};
      }

      .tag.limited-access {
        background-color: ${colors.orange};
      }

      .tag.appointment {
        background-color: ${colors.red};
      }
      `}</style>
  </div>
)

PlaceSumup.defaultProps = {
  complementAdresse: null
}

PlaceSumup.propTypes = {
  name: PropTypes.string.isRequired,
  adresse: PropTypes.string.isRequired,
  isPublic: PropTypes.bool.isRequired,
  audience: PropTypes.string.isRequired,
  appointmentOnly: PropTypes.bool.isRequired,
  complementAdresse: PropTypes.string
}

export default PlaceSumup
