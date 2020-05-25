import React, {useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {MapPin, Phone, Mail, Users, Calendar, Link} from 'react-feather'
import colors from '../../../styles/colors'

import {PrelevementsContext} from '.'

const Place = ({place, isSelected, isHovered}) => {
  const {setSelectedPlace, setHoveredPlace} = useContext(PrelevementsContext)

  const {name, adresse, isPublic, audience, complementAdresse, tel, mail, horaire, modePrelevement, appointmentOnly} = place

  const handleSelect = useCallback(() => {
    setSelectedPlace(isSelected ? null : place)
  }, [place, isSelected, setSelectedPlace])

  const getContactLink = () => {
    if (mail) {
      if (mail.includes('@')) {
        return (
          <>
            <div><Mail /></div>
            <div>
              <a href={`mailto:${mail}`} target='_blank' rel='noopener noreferrer'>{mail}</a>
            </div>
          </>
        )
      }

      if (mail.includes('www')) {
        return (
          <>
            <div><Link /></div>
            <div>
              <a href={mail} target='_blank' rel='noopener noreferrer'>{mail}</a>
            </div>
          </>
        )
      }
    }
  }

  const contactLink = getContactLink()

  return (
    <div
      className={`place-container ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      onClick={handleSelect}
      onMouseEnter={() => setHoveredPlace(place)}
      onMouseLeave={() => setHoveredPlace(null)}
    >
      <div className='title'>{name}</div>
      <div className='align-icon'>
        <div><MapPin /></div>
        <div className='address'>
          <div>{adresse}</div>
          {complementAdresse && <div className='completement'>{complementAdresse}</div>}
        </div>
      </div>

      <div className='contact'>
        <div className='align-icon'>
          <div><Phone /></div>
          <div>{tel ? <a href={`tel:${tel}`} target='_blank' rel='noopener noreferrer'>{tel}</a> : 'non rensigné'}</div >
        </div>

        <div className='align-icon'>
          {contactLink}
        </div>

        <div className='align-icon'>
          <div><Users /></div>
          {isPublic ? (
            <div className='tag'>Tout public</div>
          ) : (
            <div className='tag limited-access'>Accès limité{audience ? ` - ${audience}` : ''}</div>
          )}
        </div>

        {appointmentOnly && (
          <div className='align-icon'>
            <div><Calendar /></div>
            <div className='tag appointment'>Sur rendez-vous uniquement</div>
          </div>
        )}
      </div>

      {isSelected && (
        <div className='infos'>
          <div>
            <b>Horaires</b>: {horaire}
          </div>
          <div>
            <b>Prélèvements</b>: {modePrelevement.join(', ')}
          </div>
        </div>
      )}

      <style jsx global>{`
          .align-icon {
            display: flex;
            flex-wrap: no-wrap;
            align-items: center;
          }

          .align-icon > div {
            margin-right: 0.5em;
          }
      `}</style>

      <style jsx>{`
      .place-container {
        padding: 1em 0.5em;
        box-shadow: 0 1px 4px ${colors.lightGrey};
      }

      .hovered, .selected {
        border-left: 4px solid ${colors.blue};
        box-shadow: 0 2px 8px ${colors.grey};
        margin-right: -4px;
      }

      .place-container:hover {
        cursor: pointer;
        box-shadow: 0 2px 8px ${colors.lightGrey};
      }

      .title {
        font-size: 1.1em;
        font-weight: bold;
        margin-bottom: 1em;
      }

      .address {
        flex-direction: column;
      }

      .completement {
        font-size: small;
        font-style: italic;
      }

      .tag {
        color: ${colors.green};
      }

      .tag.limited-access {
        color: ${colors.orange};
      }

      .tag.appointment {
        color: ${colors.red};
      }

      .infos {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1em;
        margin: 1em 0;
      }
      `}</style>
    </div>
  )
}

Place.defaultProps = {
  isSelected: false,
  isHovered: false
}

Place.propTypes = {
  place: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    adresse: PropTypes.string.isRequired,
    isPublic: PropTypes.bool.isRequired,
    audience: PropTypes.string.isRequired,
    complementAdresse: PropTypes.string,
    horaire: PropTypes.string,
    modePrelevement: PropTypes.array.isRequired,
    appointmentOnly: PropTypes.bool.isRequired,
    tel: PropTypes.string,
    mail: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool,
  isHovered: PropTypes.bool
}

export default Place
