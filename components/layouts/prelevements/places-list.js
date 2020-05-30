import React, {useContext} from 'react'

import {PrelevementsContext} from '.'

import Place from './place'

const PlacesList = () => {
  const {places, selectedPlace, hoveredPlace} = useContext(PrelevementsContext)

  return (
    <div className='places-list-container'>
      {places.length > 0 && (
        <div><b>{places.length}</b> site{places.length > 1 ? 's' : ''} de prélèvement à proximité</div>
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
