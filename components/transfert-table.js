import React, {useContext} from 'react'

import {formatDate} from '../lib/date'
import allTransferts from '../transferts.json'

import colors from '../styles/colors'

import {TransfertContext} from './layouts/transfert'

const TransfertTable = () => {
  const {selectedTransferts} = useContext(TransfertContext)
  const transferts = selectedTransferts || allTransferts

  return (
    <div className='table-container'>
      <h3>
        Liste des transferts - {selectedTransferts ?
          `${selectedTransferts[0].region_depar} -> ${selectedTransferts[0].region_arrivee}` :
          'France'}
      </h3>

      <div className='transferts-list'>
        {transferts.map(transfert => {
          const {region_depart, region_arrivee, debut_transfert, fin_transfert, nombre_patients_transferes, type_vecteur} = transfert
          return (
            <div key={`${region_depart}-${region_arrivee}`} className='transfert'>
              <div>
                {debut_transfert === fin_transfert ? (
                  <>Le <b>{formatDate(debut_transfert)}</b></>
                ) : (
                  <>Du <b>{formatDate(debut_transfert)}</b> au <b>{formatDate(fin_transfert)}</b></>
                )}
              </div>
              <div><b>{nombre_patients_transferes} patients</b> transéférés</div>
              <div>{`${region_depart} → ${region_arrivee}`}</div>
              <div className='vecteur'>
                {Array.isArray(type_vecteur) ? type_vecteur.map(type => (
                  <div key={type} className='tag'>{type}</div>
                )) : (
                  <div className='tag'>{type_vecteur}</div>
                )}
              </div>
            </div>
          )
        }
        )}
      </div>
      <style jsx>{`
        .table-container {
          display: flex;
          flex: 1;
          flex-direction: column;
          margin: 0.5em;
        }

        .transferts-list {
          display: flex;
          flex-direction: column;
        }

        .transfert {
          display: flex;
          flex-direction: column;
          margin: 0.2em;
          padding: 0.4em;
          border-left: 4px solid ${colors.blue};
          background-color: ${colors.lightGrey};
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

export default TransfertTable
