import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'

import {dates} from '../lib/data'

import theme from '../styles/theme'

import Page from '../layouts/main'

import DesktopPage from '../layouts/desktop'
import MobilePage from '../layouts/mobile'

import BigPicture from '../components/layouts/big-picture'

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
    id: 'hospitalisations',
    label: 'Suivi des hospitalisations',
    component: <h1>Suivi des hospitalisations</h1>
  },
  {
    id: 'test',
    label: 'Suivi des tests',
    component: <h1>Suivi des tests</h1>
  }
]

const MainPage = () => {
  const router = useRouter()

  const [isIframe, setIsIframe] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isTouchScreenDevice, setIsTouchScreenDevice] = useState(false)
  const [date, setDate] = useState(dates[dates.length - 1])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedMapIdx, setSelectedMapIdx] = useState(1)
  const [selectedLayout, setSelectedLayout] = useState(LAYOUTS[0])

  const handleResize = () => {
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  useEffect(() => {
    const {iframe, location} = router.query

    setIsIframe(Boolean(iframe === '1'))
    setSelectedLocation(location)
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
          selectedLocation,
          setSelectedLocation,
          selectedMapIdx,
          setSelectedMapIdx,
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
