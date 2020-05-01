import React, {useState, useContext} from 'react'
import {FileText, Map, BarChart2} from 'react-feather'

import theme from '../../../styles/theme'
import colors from '../../../styles/colors'

import {AppContext, ThemeContext} from '../../../pages'

import Scrollable from '../../scrollable'
import ReactMapGl from '../../react-map-gl'
import Drom from '../../react-map-gl/drom'
import MapSelector from '../../map-selector'

import bigPictureMaps from './big-picture-maps'

import BigPictureInformations from './big-picture-informations'
import BigPictureStatistics from './big-picture-statistics'
import TerritoriesMobileMap from '../../territories-mobile-map'

export const BigPictureContext = React.createContext()

const MobileBigPicture = () => {
  const [selectedView, setSelectedView] = useState('stats')

  const app = useContext(AppContext)
  const theme = useContext(ThemeContext)

  const views = {
    map: (
      <TerritoriesMobileMap maps={bigPictureMaps} context={BigPictureContext}>
        <BigPictureStatistics />
      </TerritoriesMobileMap>
    ),
    stats: (
      <Scrollable>
        <BigPictureStatistics />
      </Scrollable>
    ),
    informations: (
      <Scrollable>
        <BigPictureInformations />
      </Scrollable>
    )
  }

  const handleClick = view => {
    app.setSelectedLocation(null)
    setSelectedView(view)
  }

  return (
    <>
      <Scrollable>
        {views[selectedView]}
      </Scrollable>

      <div className='view-selector'>
        <div className={`${selectedView === 'stats' ? 'selected' : ''}`} onClick={() => handleClick('stats')}>
          <BarChart2 size={32} color={selectedView === 'stats' ? theme.primary : colors.black} />
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

const DesktopBigPicture = () => {
  const {selectedLocation} = useContext(AppContext)
  const {selectedMapIdx, setSelectedMapIdx} = useContext(BigPictureContext)

  const {layers} = bigPictureMaps[selectedMapIdx]

  return (
    <>
      <div className='menu'>
        <Scrollable>
          <>
            <BigPictureStatistics />
            <BigPictureInformations />
          </>
        </Scrollable>
      </div>

      <div className='map'>
        <div className='metropole'>
          <div className='map-selector'>
            <MapSelector mapIdx={selectedMapIdx} maps={bigPictureMaps} selectMap={setSelectedMapIdx} />
          </div>
          <ReactMapGl code={selectedLocation || 'FRA'} layers={layers} />
        </div>
        <div className='drom-container'>
          <Drom layers={layers} />
        </div>
      </div>

      <style jsx>{`
        .menu {
          z-index: 1;
          display: flex;
          flex-direction: column;
          max-width: ${theme.menuWidth};
          box-shadow: 0 1px 4px ${colors.lightGrey};
        }

        .map {
          display: flex;
          flex: 1;
          flex-direction: column;
          height: 100%;
        }

        .metropole {
          flex: 1;
        }

        .drom-container {
          display: flex;
          padding: 0.5em;
          height: 25%;
        }

        .map-selector {
          z-index: 3;
          position: absolute;
          background-color: #000000aa;
          color: #fff;
          border-radius: 4px;
          margin: 0.5em;
        }

        @media (max-width: 1000px) {
          .drom-container {
            height: 40%;
          }
        }

        @media (max-width: 800px) {
          .drom-container {
            height: 50%;
          }
        }
      `}</style>
    </>
  )
}

const BigPicture = props => {
  const {isMobileDevice} = useContext(AppContext)

  const [selectedMapIdx, setSelectedMapIdx] = useState(1)

  const Component = isMobileDevice ? MobileBigPicture : DesktopBigPicture

  return (
    <BigPictureContext.Provider value={{selectedMapIdx, setSelectedMapIdx}}>
      <Component {...props} />
    </BigPictureContext.Provider>
  )
}

export default BigPicture
