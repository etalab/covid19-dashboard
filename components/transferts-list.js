import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {X} from 'react-feather'

import {formatDate} from '../lib/date'
import {transports} from '../lib/transports'

import colors from '../styles/colors'

import {TransfertContext} from './layouts/transfert'
import {ThemeContext} from '../pages'

const getDestination = transfert => {
  return `${transfert.regionDepart} → ${transfert.regionArrivee || 'Europe'}`
}

const Destination = ({from, to}) => (
  <div className='destination-container'>
    <span className='from'>{from}</span>
    <span>→</span>
    <span className='to'>{to}</span>
    <style jsx>{`
      .destination-container {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
      }

      .from {
        color: ${colors.red};
      }

      .to {
        color: ${colors.blue};
      }

      span {
        margin: 0 0.2em;
      }
    `}</style>
  </div>
)

Destination.propTypes = {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
}

const TransfertInfo = ({debutTransfert, finTransfert, nbPatientsTransferes, typeVecteur}) => {
  return (
    <div className='content'>
      {debutTransfert === finTransfert ? (
        <>Le <b>{formatDate(debutTransfert)}</b></>
      ) : (
        <>Du <b>{formatDate(debutTransfert)}</b> au <b>{formatDate(finTransfert)}</b></>
      )}
      <div><b>{nbPatientsTransferes} patients</b> transéférés</div>
      <div className='vecteur'>
        {typeVecteur.map(type => (
          <div key={type}><img className='icons' width={20} alt={type} title={`Transfert effectué en ${type}`} src={transports[type]} aria-hidden='true' /></div>
        ))}
      </div>

      <style jsx>{`
        .content {
          border-left: 4px solid ${colors.blue};
          background-color: ${colors.lighterGrey};
          padding: 0.4em;
          margin: 0.2em 0;
        }

        .vecteur {
          display: flex;
        }

      .icons {
          width: 1.28571429em;
          text-align: center;
          vertical-align: bottom;
          margin: .5em;
        }
        `}</style>
    </div>
  )
}

TransfertInfo.propTypes = {
  debutTransfert: PropTypes.string.isRequired,
  finTransfert: PropTypes.string.isRequired,
  nbPatientsTransferes: PropTypes.number.isRequired,
  typeVecteur: PropTypes.array.isRequired
}

const SelectedGroup = () => {
  const {selectedTransferts, setSelectedTransferts} = useContext(TransfertContext)
  const {regionDepart, regionArrivee} = selectedTransferts[0]
  const destination = getDestination(selectedTransferts[0])

  return (
    <div key={destination} className='transfert'>
      <div className='header'>
        <Destination from={regionDepart} to={regionArrivee || 'Europe'} />
        <div onClick={() => setSelectedTransferts(null)} className='close'><X /></div>
      </div>

      {selectedTransferts.map(transfert => (
        <TransfertInfo key={destination} {...transfert} />
      ))}

      <style jsx>{`
        .transfert {
          display: flex;
          flex-direction: column;
          margin: 0.2em 0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-flow: wrap;
          margin-bottom: 0.2em;
        }

        .close:hover {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

const GroupedTranferts = () => {
  const themeContext = useContext(ThemeContext)
  const {transfertsGroup, setSelectedTransferts} = useContext(TransfertContext)

  const handleSelect = transferts => {
    if (transferts.length > 1) {
      setSelectedTransferts(transferts)
    }
  }

  return (
    transfertsGroup.map(group => {
      const destination = getDestination(group)
      const {regionDepart, regionArrivee, transferts} = group
      return (
        <div key={destination} className='transfert'>
          <div className='header'>
            <Destination from={regionDepart} to={regionArrivee || 'Europe'} />
            <div className={`tag ${transferts.length > 1 ? 'show-transferts' : ''}`} onClick={() => handleSelect(transferts)}><b>{transferts.length} transfert{transferts.length > 1 ? 's' : ''}</b></div>
          </div>

          <TransfertInfo {...group} />

          <style jsx>{`
            .transfert {
              display: flex;
              flex-direction: column;
              margin: 0.2em 0;
            }

            .transferts-list {
              display: flex;
              flex: 1;
              flex-direction: column;
              margin: 0.5em;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-flow: wrap;
              margin-bottom: 0.2em;
            }

            .tag {
              padding: 0.4em;
              margin: 0.2em;
              text-align: center;
              border-radius: 4px;
            }

            .tag.show-transferts {
              background-color: whitesmoke;
            }

            .tag.show-transferts:hover {
              cursor: pointer;
              background-color: ${themeContext.primary};
              color: ${colors.white};
            }
          `}</style>
        </div>
      )
    })
  )
}

const TransferstList = () => {
  const {selectedTransferts} = useContext(TransfertContext)

  return (
    <div className='transferts-list'>
      <h3>Liste des transferts</h3>

      {selectedTransferts ? (
        <SelectedGroup />
      ) : (
        <GroupedTranferts />
      )}

      <style jsx>{`
        .transferts-list {
          margin: 0 0.5em;
        }
      `}</style>
    </div>
  )
}

export default TransferstList
