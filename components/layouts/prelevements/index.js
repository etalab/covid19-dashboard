import React, {useState, useEffect, useContext} from 'react'
import {X} from 'react-feather'

import prelevementsSites from '../../../public/data/prelevements.json'

import theme from '../../../styles/theme'
import colors from '../../../styles/colors'

import {AppContext} from '../../../pages'

import Scrollable from '../../scrollable'

import PrelevementsMap from './prelevement-map'
import SearchAddress from './search-address'
import PlacesList from './places-list'
import Place from './place'

export const PrelevementsContext = React.createContext()

const MobilePrelevements = () => {
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

const DesktopPrelevements = () => {
  return (
    <>
      <div className='menu'>
        <Scrollable>
          <SearchAddress />
          <PlacesList />
        </Scrollable>
      </div>

      <div className='map'>
        <PrelevementsMap />
      </div>

      <style jsx>{`
        .menu {
          z-index: 1;
          display: flex;
          flex-direction: column;
          max-width: ${theme.menuWidth};
          box-shadow: 0 1px 4px ${colors.lightGrey};
          width: 100%;
          padding: 1em;
        }

        .map {
          display: flex;
          flex: 1;
          flex-direction: column;
          height: 100%;
        }
      `}</style>
    </>
  )
}

const Prelevements = props => {
  const {isMobileDevice} = useContext(AppContext)

  const [selectedPlace, setSelectedPlace] = useState(null)
  const [hoveredPlace, setHoveredPlace] = useState(null)
  const [places, setPlaces] = useState([])
  const [address, setAddress] = useState(null)

  const Component = isMobileDevice ? MobilePrelevements : DesktopPrelevements

  useEffect(() => {
    if (address) {
      setSelectedPlace(null)
    }
  }, [address])

  return (
    <PrelevementsContext.Provider value={{
      prelevementsSites,
      address,
      setAddress,
      selectedPlace,
      setSelectedPlace,
      places,
      setPlaces,
      hoveredPlace,
      setHoveredPlace
    }}
    >
      <Component {...props} />
    </PrelevementsContext.Provider>
  )
}

export default Prelevements
