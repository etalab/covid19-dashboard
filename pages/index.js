import React, {useState, useEffect} from 'react'
import Router from 'next/router'

import dates from '../dates.json'

import theme from '../styles/theme'

import Page from '../layouts/main'

import DesktopPage from '../layouts/desktop'
import MobilePage from '../layouts/mobile'

import BigPicture from '../components/layouts/big-picture'
import CovidTests from '../components/layouts/covid-tests'
import Transfert from '../components/layouts/transfert'
// Temporary : import Synthese from '../components/layouts/synthese'
import Indicators from '../components/layouts/indicators'
import Prelevements from '../components/layouts/prelevements'
import Entreprises from '../components/layouts/entreprises'

export const AppContext = React.createContext()
export const ThemeContext = React.createContext('theme.default')

const MOBILE_WIDTH = Number.parseInt(theme.mobileDisplay.split('px')[0], 10)
const TABLET_WIDTH = Number.parseInt(theme.tabletDisplay.split('px')[0], 10)

const LAYOUTS = [
  {
    id: 'big-picture',
    name: 'vue-d-ensemble',
    label: 'Vue d’ensemble',
    component: <BigPicture />
  },
  // {
  //   id: 'synthese',
  //   name: 'activite-epidemique',
  //   label: 'Carte de vigilance',
  //   component: <Synthese />
  // },
  {
    id: 'indicators',
    name: 'suivi-indicateurs',
    label: 'Carte des indicateurs',
    component: <Indicators />
  },
  {
    id: 'prelevements',
    name: 'sites-prelevements',
    label: 'Sites de prélèvements',
    component: <Prelevements />
  },
  {
    id: 'tests',
    name: 'suivi-des-tests',
    label: 'Suivi des tests',
    component: <CovidTests />
  },
  {
    id: 'entreprises',
    name: 'aides-entreprises',
    label: 'Aides entreprises',
    component: <Entreprises />
  },
  {
    id: 'transfert',
    name: 'transferts-de-patients',
    label: 'Transferts de patients',
    component: <Transfert />
  }
]

function getLayout(layoutId) {
  return LAYOUTS.find(l => l.id === layoutId)
}

function hasLayout(layoutId) {
  return Boolean(getLayout(layoutId))
}

const MainPage = () => {
  const [isIframe, setIsIframe] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isTabletDevice, setIsTabletDevice] = useState(false)
  const [isTouchScreenDevice, setIsTouchScreenDevice] = useState(false)
  const [date, setDate] = useState(dates[dates.length - 1])
  const [forcedDate, setForcedDate] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState('FRA')
  const [selectedLayout, setSelectedLayout] = useState(getLayout('big-picture'))

  const handleResize = () => {
    setIsTabletDevice(window.innerWidth > MOBILE_WIDTH && window.innerWidth < TABLET_WIDTH)
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  useEffect(() => {
    let as = `/${selectedLayout.name}`

    if (selectedLocation) {
      as += `?location=${selectedLocation}`
    }

    Router.push({
      pathname: '/',
      query: {
        ...Router.query,
        layout: selectedLayout.id,
        location: selectedLocation
      }
    }, as)
  }, [selectedLayout, selectedLocation])

  useEffect(() => {
    const {iframe, location, layout} = Router.query
    setIsIframe(Boolean(iframe === '1'))
    setSelectedLocation(location || 'FRA')

    if (layout && hasLayout(layout)) {
      setSelectedLayout(getLayout(layout))
    } else {
      setSelectedLayout(getLayout('big-picture'))
    }
  }, [])

  useEffect(() => {
    if (window.innerWidth < MOBILE_WIDTH) {
      setIsMobileDevice(true)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setIsTouchScreenDevice('ontouchstart' in document.documentElement)
  }, [])

  return (
    <Page title='Tableau de bord de suivi de l’épidémie de coronavirus en France'>

      <div className='main-page-container'>
        <AppContext.Provider value={{
          date,
          setDate,
          forcedDate,
          setForcedDate,
          selectedLocation,
          setSelectedLocation,
          isIframe,
          isMobileDevice,
          isTabletDevice,
          isTouchScreenDevice,
          selectedLayout,
          setSelectedLayout,
          layouts: LAYOUTS
        }}
        >
          <ThemeContext.Provider value={theme.gouv}>
            {isMobileDevice ? (
              <MobilePage />
            ) : (
              <DesktopPage />
            )}
          </ThemeContext.Provider>
        </AppContext.Provider>

        <style jsx>{`
          .main-page-container {
            display: flex;
            position: absolute;
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    </Page>
  )
}

MainPage.getInitialProps = () => {
  return {}
}

export default MainPage
