import React, {useState, useContext, useEffect} from 'react'
import {FileText, Map, BarChart2} from 'react-feather'

import theme from '../../../styles/theme'
import colors from '../../../styles/colors'

import {AppContext, ThemeContext} from '../../../pages'

import {findMostRecentDateForData, getReport} from '../../../lib/data'

import Scrollable from '../../scrollable'
import BigPictureInformations from '../big-picture/big-picture-informations'

import CovidTestsMaps from './covid-tests-maps'

import CovidTestsStatistics from './covid-tests-statistics'
import TerritoriesMobileMap from '../../territories-mobile-map'
import TerritoriesDesktopMap from '../../territories-desktop-map'

export const CovidTestsContext = React.createContext()

const MobileCovidTests = () => {
  const [selectedView, setSelectedView] = useState('stats')

  const app = useContext(AppContext)
  const theme = useContext(ThemeContext)

  const views = {
    map: (
      <TerritoriesMobileMap
        maps={CovidTestsMaps}
        context={CovidTestsContext}
      >
        <CovidTestsStatistics />
      </TerritoriesMobileMap>
    ),
    stats: (
      <Scrollable>
        <CovidTestsStatistics />
      </Scrollable>
    ),
    informations: (
      <Scrollable>
        <BigPictureInformations />
      </Scrollable>
    )
  }

  const handleClick = view => {
    app.setSelectedLocation('FRA')
    setSelectedView(view)
  }

  return (
    <>
      {views[selectedView]}

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

const DesktopCovidTests = () => {
  return (
    <>
      <div className='menu'>
        <Scrollable>
          <CovidTestsStatistics />
        </Scrollable>
      </div>

      <div className='map'>
        <TerritoriesDesktopMap maps={CovidTestsMaps} context={CovidTestsContext} />
      </div>

      <style jsx>{`
        .menu {
          z-index: 1;
          display: flex;
          flex-direction: column;
          max-width: ${theme.menuWidth};
          width: ${theme.menuWidth};
          box-shadow: 0 1px 4px ${colors.lightGrey};
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

const CovidTests = props => {
  const {date, setForcedDate, selectedLocation, isMobileDevice} = useContext(AppContext)

  const [selectedMapId, setSelectedMapId] = useState('Tests positifs en laboratoires de ville - ce jour')

  const Component = isMobileDevice ? MobileCovidTests : DesktopCovidTests

  useEffect(() => {
    let isCancelled = false

    async function fetchMostRecentDateForData() {
      const report = await getReport(date, selectedLocation)
      const mostRecentDate = findMostRecentDateForData(report, 'testsRealises')
      if (!isCancelled) {
        setForcedDate(mostRecentDate === date ? null : mostRecentDate)
      }
    }

    fetchMostRecentDateForData()

    return () => {
      isCancelled = true
      setForcedDate(null)
    }
  }, [date, selectedLocation, setForcedDate])

  return (
    <CovidTestsContext.Provider value={{selectedMapId, setSelectedMapId}}>
      <Component {...props} />
    </CovidTestsContext.Provider>
  )
}

export default CovidTests
