import React, {useState, useEffect, useContext} from 'react'
import {FileText, Map, List} from 'react-feather'

import prelevementsSites from '../../../public/data/prelevements.json'

import theme from '../../../styles/theme'
import colors from '../../../styles/colors'

import {AppContext, ThemeContext} from '../../../pages'

import Scrollable from '../../scrollable'

import PrelevementsMap from './prelevement-map'
import PrelevementsInformations from './prelevements-informations'
import SearchAddress from './search-address'
import PlacesList from './places-list'
import PrelevementsMobileMap from './prelevements-mobile-map'

export const PrelevementsContext = React.createContext()

const MobilePrelevements = () => {
  const [selectedView, setSelectedView] = useState('map')

  const app = useContext(AppContext)
  const theme = useContext(ThemeContext)

  const views = {
    map: (
      <PrelevementsMobileMap />
    ),
    stats: (
      <Scrollable>
        <PlacesList />
      </Scrollable>
    ),
    informations: (
      <Scrollable>
        <PrelevementsInformations />
      </Scrollable>
    )
  }

  const handleClick = view => {
    app.setSelectedLocation('FRA')
    setSelectedView(view)
  }

  return (
    <>
      <Scrollable>
        {views[selectedView]}
      </Scrollable>

      <div className='view-selector'>
        <div className={`${selectedView === 'stats' ? 'selected' : ''}`} onClick={() => handleClick('stats')}>
          <List size={32} color={selectedView === 'stats' ? theme.primary : colors.black} />
        </div>
        <div className={`${selectedView === 'map' ? 'selected' : ''}`} onClick={() => handleClick('map')}>
          <Map size={32} color={selectedView === 'map' ? theme.primary : colors.black} />
        </div>
        <div className={`${selectedView === 'informations' ? 'selected' : ''}`} onClick={() => handleClick('informations')}>
          <FileText size={32} color={selectedView === 'informations' ? theme.primary : colors.black} />
        </div>
      </div>

      <style jsx>{`
        .view-selector {
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          box-shadow: 0 -1px 4px ${colors.lightGrey};
        }

        .view-selector > div {
          padding: 0.5em;
          margin: auto;
          margin-bottom: -4px;
        }

        .view-selector > div.selected {
          border-top: 4px solid ${theme.primary};
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
          <div style={{padding: '1em'}}>
            <h4>Saisissez une adresse pour retrouver tous les points de prélèvement des tests virologiques (RT-PCR) à proximité !</h4>
            <SearchAddress />
            <PlacesList />
          </div>
          <PrelevementsInformations />
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
