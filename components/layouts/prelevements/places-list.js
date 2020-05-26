import React, {useContext} from 'react'

import Counter from '../../counter'

import {PrelevementsContext} from '.'

import Place from './place'

const PlacesList = () => {
  const {address, prelevementsSites, places, selectedPlace, hoveredPlace} = useContext(PrelevementsContext)

  return (
    <div className='places-list-container'>
      {address ? (
        places.length > 0 ? (
          <div><b>{places.length}</b> site{places.length > 1 ? 's' : ''} de prélèvement à proximité</div>
        ) : (
          <div><b>Aucun</b> site de prélèvement n’est diponible à proximité de cette adresse</div>
        )
      ) : (
        <div>
          <h3>Sites de prélèvements du COVID-19</h3>
          <div className='counters'>
            <Counter
              value={prelevementsSites.features.filter(({properties}) => properties.isPublic).length}
              label='Tout public'
              color='green'
              details='Site de prélèvement de COVID-19 ouvert à tout public'
              isBig
            />
            <Counter
              value={prelevementsSites.features.filter(({properties}) => !properties.isPublic).length}
              label='Accès limité'
              color='orange'
              details='Site de prélèvement de COVID-19 ouvert uniquement sous certaines conditions'
              isBig
            />
          </div>
        </div >
      )}

      {places.map(place => (
        <Place
          key={place.id}
          place={place}
          isSelected={selectedPlace && selectedPlace.id === place.id}
          isHovered={hoveredPlace && hoveredPlace.id === place.id}
        />
      ))}

      <style jsx>{`
        .places-list-container {
          padding: 0.5em;
          display: grid;
          grid-row-gap: 1em;
          margin: 1em 0;
        }

        .counters {
          display: flex;
          justify-content: space-between;
          align-items; center;
        }
      `}</style>
    </div>
  )
}

export default PlacesList
