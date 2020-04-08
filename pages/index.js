import React, {useState, useCallback, useEffect} from 'react'
import {useRouter} from 'next/router'
import {indexOf} from 'lodash'

import {reportToGeoJSON, getReport, dates, getPreviousDate} from '../lib/data'

import theme from '../styles/theme'

import Page from '../layouts/main'

import {
  decesLayer,
  decesCountLayer,
  hospitalisesLayer,
  hospitalisesCountLayer,
  reanimationLayer,
  reanimationCountLayer,
  guerisLayer,
  guerisCountLayer
} from '../components/react-map-gl/layers'

import ScreenPage from '../layouts/screen'
import MobilePage from '../layouts/mobile'

export const AppContext = React.createContext()
export const ThemeContext = React.createContext('theme.default')

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 5
}

const MainPage = () => {
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

  const previousDate = getPreviousDate(date)

  const handleResize = () => {
    const mobileWidth = Number.parseInt(theme.mobileDisplay.split('px')[0], 10)
    setIsMobileDevice(window.innerWidth < mobileWidth)
  }

  const getLocationReport = useCallback(code => {
    let report

    if (code.includes('REG')) {
      report = regionsReport
    } else if (code.includes('DEP')) {
      report = departementsReport
    }

    const feature = report.features.find(f => f.properties.code === code)
    return {...feature.properties}
  }, [regionsReport, departementsReport])

  const getPreviousLocationReport = useCallback(code => {
    let report

    if (code.includes('REG')) {
      report = previousRegionsReport
    } else if (code.includes('DEP')) {
      report = previousDepartementsReport
    }

    const feature = report.features.find(f => f.properties.code === code)
    return {...feature.properties}
  }, [previousRegionsReport, previousDepartementsReport])

  useEffect(() => {
    if (selectedLocation) {
      const locationReport = getLocationReport(selectedLocation)
      const previousLocationReport = getPreviousLocationReport(selectedLocation)
      setSelectedLocationReport(locationReport)
      setSelectedPreviousLocationReport(previousLocationReport)
    } else {
      setSelectedLocationReport(null)
      setSelectedPreviousLocationReport(null)
    }
  }, [selectedLocation, getLocationReport, getPreviousLocationReport])

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
    setRegionsReport(reportToGeoJSON(regionsReport, date))

    const previousRegionsReport = getReport(previousDate, 'REG')
    setPreviousRegionsReport(reportToGeoJSON(previousRegionsReport, previousDate))

    const departementsReport = getReport(date, 'DEP')
    setDepartementsReport(reportToGeoJSON(departementsReport, date))

    const previousDepartementsReport = reportToGeoJSON(getReport(previousDate, 'DEP'), date)
    setPreviousDepartementsReport(previousDepartementsReport)
  }, [date, previousDate])

  useEffect(() => {
    const mobileWidth = Number.parseInt(theme.mobileDisplay.split('px')[0], 10)
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

  const maps = [
    {
      name: 'Carte des décès à l’hôpital',
      category: 'régionale',
      data: regionsReport,
      properties: 'deces',
      layers: [decesLayer, decesCountLayer]
    },
    {
      name: 'Carte des hospitalisations',
      category: 'régionale',
      properties: 'hospitalises',
      data: regionsReport,
      layers: [hospitalisesLayer, hospitalisesCountLayer]
    },
    {
      name: 'Carte des patients en réanimation',
      category: 'régionale',
      properties: 'reanimation',
      data: regionsReport,
      layers: [reanimationLayer, reanimationCountLayer]
    },
    {
      name: 'Carte des retours à domicile',
      category: 'régionale',
      properties: 'gueris',
      data: regionsReport,
      layers: [guerisLayer, guerisCountLayer]
    },
    {
      name: 'Carte des décès à l’hôpital',
      category: 'départementale',
      data: departementsReport,
      properties: 'deces',
      layers: [decesLayer, decesCountLayer]
    },
    {
      name: 'Carte des hospitalisations',
      category: 'départementale',
      properties: 'hospitalises',
      data: departementsReport,
      layers: [hospitalisesLayer, hospitalisesCountLayer]
    },
    {
      name: 'Carte des patients en réanimation',
      category: 'départementale',
      properties: 'reanimation',
      data: departementsReport,
      layers: [reanimationLayer, reanimationCountLayer]
    },
    {
      name: 'Carte des retours à domicile',
      category: 'départementale',
      properties: 'gueris',
      data: departementsReport,
      layers: [guerisLayer, guerisCountLayer]
    }
  ]

  return (
    <Page title='Tableau de bord de suivi de l’épidémie de coronavirus en France'>

      <div className='main-page-container'>
        <AppContext.Provider value={{
          date,
          setDate,
          selectedLocationReport,
          selectedPreviousLocationReport,
          setSelectedLocation,
          franceReport,
          previousFranceReport,
          regionsReport,
          departementsReport,
          setViewport,
          maps,
          viewport,
          isIframe,
          isMobileDevice,
          isTouchScreenDevice
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

export default MainPage
