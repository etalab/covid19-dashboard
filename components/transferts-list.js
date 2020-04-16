import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {X} from 'react-feather'

import {formatDate} from '../lib/date'

import colors from '../styles/colors'

import {TransfertContext} from './layouts/transfert'

const getDestination = transfert => {
  return `${transfert.regionDepart} → ${transfert.regionArrivee || 'Europe'}`
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
          <div key={type} className='tag'>{type}</div>
        ))}
      </div>

      <style jsx>{`
        .content {
          border-left: 4px solid ${colors.blue};
          background-color: ${colors.lightGrey};
          padding: 0.4em;
          margin: 0.2em 0;
        }

        .vecteur {
          display: flex;
        }

        .tag {
          padding: 0.2em;
          background-color: whitesmoke;
          margin: 0.2em;
          text-align: center;
          border-radius: 4px;
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
  const destination = getDestination(selectedTransferts[0])

  return (
    <div key={destination} className='transfert'>
      <div className='header'>
        <div>{destination}</div>
        <div onClick={() => setSelectedTransferts(null)}><X /></div>
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
      `}</style>
    </div>
  )
}

const GroupedTranferts = () => {
  const {transfertsGroup, setSelectedTransferts} = useContext(TransfertContext)

  const handleSelect = transferts => {
    if (transferts.length > 1) {
      setSelectedTransferts(transferts)
    }
  }

  return (
    transfertsGroup.map(group => {
      const destination = getDestination(group)
      const {transferts} = group
      return (
        <div key={destination} className='transfert'>
          <div className='header'>
            <div>{destination}</div>
            <div className={transferts.length > 1 ? 'show-transferts' : ''} onClick={() => handleSelect(transferts)}><b>{transferts.length} transferts</b></div>
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

            .show-transferts {
              text-decoration: underline;
            }

            .show-transferts:hover {
              cursor: pointer;
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
