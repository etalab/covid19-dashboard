import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {groupBy, uniq, indexOf} from 'lodash'

import {getData} from '../lib/api'

import centers from '../centers.json'

import theme from '../styles/theme'

import Page from '../layouts/main'

import {
  casConfirmesLayer,
  casConfirmesCountLayer,
  decesLayer,
  decesCountLayer,
  hospitalisesLayer,
  hospitalisesCountLayer,
  reanimationLayer,
  reanimationCountLayer
} from '../components/react-map-gl/layers'

import ScreenPage from '../layouts/screen'
import MobilePage from '../layouts/mobile'

export const AppContext = React.createContext()
export const ThemeContext = React.createContext('theme.default')

const reportToGeoJSON = (report, date) => {
  return {
    type: 'FeatureCollection',
    features: Object.keys(report).filter(code => Boolean(centers[code])).map(code => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: centers[code]
        },
        properties: {
          ...report[code].find(r => r.date === date),
          history: report[code].filter(r => date >= r.date)
        }
      }
    }).filter(i => Boolean(i))
  }
}

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 5
}

const MainPage = ({data, dates, isIframe, isGouv}) => {
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isTouchScreenDevice, setIsTouchScreenDevice] = useState(false)
  const [date, setDate] = useState(dates[dates.length - 1])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedLocationReport, setSelectedLocationReport] = useState(null)
  const [franceReport, setFranceReport] = useState({})
  const [regionsReport, setRegionsReport] = useState({})
  const [departementsReport, setDepartementsReport] = useState({})
  const [viewport, setViewport] = useState(defaultViewport)

  const dateIdx = indexOf(dates, date)

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

  const getFranceReport = useCallback(() => {
    const reports = data.filter((item => item.nom === 'France'))
    return {
      ...reports.find(r => r.date === date),
      history: reports
    }
  }, [date, data])

  const getRegionsReport = useCallback(() => {
    const regions = data.filter((item => item.code.includes('REG')))
    const byCode = groupBy(regions, 'code')

    return reportToGeoJSON(byCode, date)
  }, [date, data])

  const getDepartementsReport = useCallback(() => {
    const departements = data.filter((item => item.code.includes('DEP')))
    const byCode = groupBy(departements, 'code')

    return reportToGeoJSON(byCode, date)
  }, [date, data])

  const handleResize = () => {
    const mobileWidth = theme.mobileDisplay.split('px')[0]
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

  useEffect(() => {
    if (selectedLocation) {
      const locationReport = getLocationReport(selectedLocation)
      setSelectedLocationReport(locationReport)
    } else {
      setSelectedLocationReport(null)
    }
  }, [regionsReport, selectedLocation, getLocationReport])

  useEffect(() => {
    const {latitude, longitude} = viewport
    setViewport({
      latitude,
      longitude,
      zoom: isMobileDevice ? 4.3 : 5
    })
  }, [isMobileDevice]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const franceReport = getFranceReport()
    setFranceReport(franceReport)

    const regionsReport = getRegionsReport()
    setRegionsReport(regionsReport)

    const departementsReport = getDepartementsReport()
    setDepartementsReport(departementsReport)
  }, [date, getFranceReport, getRegionsReport, getDepartementsReport])

  useEffect(() => {
    const mobileWidth = theme.mobileDisplay.split('px')[0]
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
      name: 'Carte des cas confirmés',
      category: 'régionale',
      data: regionsReport,
      properties: 'casConfirmes',
      layers: [casConfirmesLayer, casConfirmesCountLayer]
    },
    {
      name: 'Carte des décès',
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
      name: 'Carte des cas en réanimation',
      category: 'régionale',
      properties: 'reanimation',
      data: regionsReport,
      layers: [reanimationLayer, reanimationCountLayer]
    },
    {
      name: 'Carte des cas confirmés',
      category: 'départementale',
      data: departementsReport,
      properties: 'casConfirmes',
      layers: [casConfirmesLayer, casConfirmesCountLayer]
    },
    {
      name: 'Carte des décès',
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
      name: 'Carte des cas en réanimation',
      category: 'départementale',
      properties: 'reanimation',
      data: departementsReport,
      layers: [reanimationLayer, reanimationCountLayer]
    }
  ]

  return (
    <Page title='Tableau de bord de suivi de l’épidémie de coronavirus en France'>

      <div className='main-page-container'>
        <AppContext.Provider value={{
          date,
          selectedLocationReport,
          setSelectedLocation,
          franceReport,
          regionsReport,
          departementsReport,
          prev: dateIdx > 0 ? previousReport : null,
          next: dateIdx < dates.length - 1 ? nextReport : null,
          setViewport,
          maps,
          viewport,
          isIframe,
          isMobileDevice,
          isTouchScreenDevice
        }}
        >
          <ThemeContext.Provider value={isGouv ? theme.gouv : theme.default}>
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

MainPage.defaultProps = {
  isIframe: false,
  isGouv: false
}

MainPage.propTypes = {
  data: PropTypes.array.isRequired,
  dates: PropTypes.array.isRequired,
  isIframe: PropTypes.bool,
  isGouv: PropTypes.bool
}

MainPage.getInitialProps = async ({query}) => {
  const {iframe} = query
  const {gouv} = query
  const data = await getData()

  return {
    data,
    isIframe: Boolean(iframe === '1'),
    isGouv: Boolean(gouv === '1'),
    dates: uniq(data.filter(r => r.code === 'FRA').map(r => r.date)).sort()
  }
}

export default MainPage
