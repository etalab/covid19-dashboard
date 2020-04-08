import React, {useState, useCallback, useEffect} from 'react'
import {useRouter} from 'next/router'
import PropTypes from 'prop-types'
import {uniq, indexOf} from 'lodash'

import records from '../chiffres-cles.json'
import theme from '../styles/theme'

import Page from '../layouts/main'

import ScreenPage from '../layouts/screen'
import MobilePage from '../layouts/mobile'

export const AppContext = React.createContext()
export const ThemeContext = React.createContext('theme.default')

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 5
}

const MainPage = ({data, dates}) => {
  const router = useRouter()

  const [isIframe, setIsIframe] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isTouchScreenDevice, setIsTouchScreenDevice] = useState(false)
  const [date, setDate] = useState(dates[dates.length - 1])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedLocationReport, setSelectedLocationReport] = useState(null)
  const [selectedPreviousLocationReport, setSelectedPreviousLocationReport] = useState(null)
  const [franceReport, setFranceReport] = useState({})
  const [previousFranceReport, setPreviousFranceReport] = useState({})
  const [regionsReport, setRegionsReport] = useState({})
  const [previousRegionsReport, setPreviousRegionsReport] = useState({})
  const [departementsReport, setDepartementsReport] = useState({})
  const [previousDepartementsReport, setPreviousDepartementsReport] = useState({})
  const [viewport, setViewport] = useState(defaultViewport)
  const [selectedData, setSelectedData] = useState()
  const [mapReport, setMapReport] = useState(null)

  const dateIdx = indexOf(dates, date)
  const previousDate = dates[dateIdx - 1]

  const previousReport = useCallback(() => {
    const idx = indexOf(dates, date)
    const previousIdx = idx - 1

    if (previousIdx >= 0) {
      setDate(dates[previousIdx])
    }
  }, [dates, date])

  const nextReport = useCallback(() => {
    const idx = indexOf(dates, date)
    const nextIdx = idx + 1
    if (nextIdx <= dates.length - 1) {
      setDate(dates[nextIdx])
    }
  }, [dates, date])

  const getReport = useCallback((date, code) => {
    const filteredReports = data.filter(item => item.code.includes(code))
    return {
      ...filteredReports.find(r => r.date === date),
      history: filteredReports
    }
  }, [data])

  const handleResize = () => {
    const mobileWidth = parseInt(theme.mobileDisplay.split('px')[0])
    setIsMobileDevice(window.innerWidth < mobileWidth)
  }

  useEffect(() => {
    if (selectedLocation) {
      const locationReport = getReport(date, selectedLocation)
      const previousLocationReport = getReport(previousDate, selectedLocation)
      setSelectedLocationReport(locationReport)
      setSelectedPreviousLocationReport(previousLocationReport)
    } else {
      setSelectedLocationReport(null)
      setSelectedPreviousLocationReport(null)
    }
  }, [selectedLocation, date, previousDate, getReport])

  useEffect(() => {
    const {latitude, longitude} = viewport
    setViewport({
      latitude,
      longitude,
      zoom: isMobileDevice ? 4.3 : 5
    })
  }, [isMobileDevice]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const {iframe, location} = router.query

    setIsIframe(Boolean(iframe === '1'))
    setSelectedLocation(location)
  }, [router])

  useEffect(() => {
    const franceReport = getReport(date, 'FRA')
    setFranceReport(franceReport)

    const previousFranceReport = getReport(previousDate, 'FRA')
    setPreviousFranceReport(previousFranceReport)

    const regionsReport = getReport(date, 'REG')
    setRegionsReport(regionsReport, date)

    const previousRegionsReport = getReport(previousDate, 'REG')
    setPreviousRegionsReport(previousRegionsReport, previousDate)

    const departementsReport = getReport(date, 'DEP')
    setDepartementsReport(departementsReport, date)

    const previousDepartementsReport = getReport(previousDate, 'DEP')
    setPreviousDepartementsReport(previousDepartementsReport, date)
  }, [date, dates, dateIdx, getReport, previousDate])

  useEffect(() => { // Init mapReport
    if (!mapReport && Object.keys(regionsReport).length > 0) {
      setMapReport(regionsReport)
    }
  }, [mapReport, regionsReport])

  useEffect(() => {
    const mobileWidth = parseInt(theme.mobileDisplay.split('px')[0])
    if (window.innerWidth < mobileWidth) {
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
          selectedLocationReport,
          selectedPreviousLocationReport,
          setSelectedLocation,
          franceReport,
          previousFranceReport,
          regionsReport,
          departementsReport,
          prev: dateIdx > 0 ? previousReport : null,
          next: dateIdx < dates.length - 1 ? nextReport : null,
          setViewport,
          mapReport,
          setMapReport,
          viewport,
          isIframe,
          isMobileDevice,
          isTouchScreenDevice,
          selectedData,
          setSelectedData
        }}
        >
          <ThemeContext.Provider value={theme.gouv}>
            {isMobileDevice ? (
              <MobilePage />
            ) : (
              <ScreenPage />
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

MainPage.propTypes = {
  data: PropTypes.array.isRequired,
  dates: PropTypes.array.isRequired
}

MainPage.getInitialProps = async () => {
  return {
    data: records,
    dates: uniq(records.filter(r => r.code === 'FRA').map(r => r.date)).sort()
  }
}

export default MainPage
