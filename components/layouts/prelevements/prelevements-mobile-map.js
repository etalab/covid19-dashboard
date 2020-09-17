import React, {useContext} from 'react'
import {X} from 'react-feather'

import Scrollable from '../../scrollable'

import {PrelevementsContext} from '.'

import SearchAddress from './search-address'
import PrelevementsMap from './prelevement-map'
import Place from './place'

const PrelevementsMobileMap = () => {
  const {selectedPlace, setSelectedPlace} = useContext(PrelevementsContext)

  return (
    <>
      <div className='search-bar'>
        <SearchAddress />
      </div>

      <div className='map-container'>
        <Scrollable>

          <PrelevementsMap />

          <div className={`place ${selectedPlace ? 'show' : 'hide'}`}>
            {selectedPlace && (
              <>
                <div className='close'><X onClick={() => setSelectedPlace(null)} /></div>
                <Place place={selectedPlace} isSelected />
              </>
            )}
          </div>
        </Scrollable>
      </div>

      <style jsx>{`
        .search-bar {
          width: 100%;
        }

        .map-container {
          display: flex;
          height: 100%;
          flex-direction: column;
        }

        .place {
          position: relative;
          transition: 0.5s;
        }

        .show {
          height: 100%;
        }

        .hide {
          height: 0;
        }

        .close {
          position: absolute;
          right: 0;
        }
      `}</style>
    </>
  )
}

export default PrelevementsMobileMap
