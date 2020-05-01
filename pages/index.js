import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'

import dates from '../dates.json'

import theme from '../styles/theme'

import Page from '../layouts/main'

import DesktopPage from '../layouts/desktop'
import MobilePage from '../layouts/mobile'

import BigPicture from '../components/layouts/big-picture'
import CovidTests from '../components/layouts/covid-tests'
import Transfert from '../components/layouts/transfert'
import Synthese from '../components/layouts/synthese'

export const AppContext = React.createContext()
export const ThemeContext = React.createContext('theme.default')

const MOBILE_WIDTH = Number.parseInt(theme.mobileDisplay.split('px')[0], 10)

const LAYOUTS = [
  {
    id: 'big-picture',
    label: 'Vue d’ensemble',
    component: <BigPicture />
  },
  {
    id: 'tests',
    label: 'Suivi des tests',
    component: <CovidTests />
  },
  {
    id: 'transfert',
    label: 'Transferts de patients',
    component: <Transfert />
  },
  {
    id: 'synthese',
    label: 'Activité épidémique',
    component: <Synthese />
  }
]

const MainPage = () => {
  const router = useRouter()

  const [isIframe, setIsIframe] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isTouchScreenDevice, setIsTouchScreenDevice] = useState(false)
  const [date, setDate] = useState(dates[dates.length - 1])
  const [forcedDate, setForcedDate] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState('FRA')
  const [selectedLayout, setSelectedLayout] = useState(LAYOUTS[0])

  const handleResize = () => {
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  useEffect(() => {
    const {iframe, location} = router.query
    setIsIframe(Boolean(iframe === '1'))
    setSelectedLocation(location || 'FRA')
  }, [router])

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
