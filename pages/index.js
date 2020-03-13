import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {groupBy, uniq, indexOf} from 'lodash'

import {getData} from '../lib/api'

import centers from '../centers.json'

import theme from '../styles/theme'

import Page from '../layouts/main'

import ScreenPage from '../layouts/screen'
import MobilePage from '../layouts/mobile'

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 5
}

const MainPage = ({data, dates}) => {
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [date, setDate] = useState(dates[dates.length - 1])
  const [franceReport, setFranceReport] = useState({})
  const [regionsReport, setRegionsReport] = useState({})
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

    return {
      type: 'FeatureCollection',
      features: Object.keys(byCode).map(code => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: centers[code]
          },
          properties: {
            ...byCode[code].find(r => r.date === date),
            history: byCode[code].filter(r => date >= r.date)
          }
        }
      }).filter(i => Boolean(i))
    }
  }, [date, data])

  const handleResize = () => {
    const mobileWidth = theme.mobileDisplay.split('px')[0]
    setIsMobileDevice(window.innerWidth < mobileWidth)
  }

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
  }, [date, getFranceReport, getRegionsReport])

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

  return (
    <Page title='Tableau de bord de suivi de l’épidémie de nouveau coronavirus'>
      <div className='main-page-container'>
        {isMobileDevice ? (
          <MobilePage
            date={date}
            franceReport={franceReport}
            regionsReport={regionsReport}
            prev={dateIdx > 0 ? previousReport : null}
            next={dateIdx < dates.length - 1 ? nextReport : null}
            setViewport={setViewport}
            viewport={viewport}
          />
        ) : (
          <ScreenPage
            date={date}
            franceReport={franceReport}
            regionsReport={regionsReport}
            prev={dateIdx > 0 ? previousReport : null}
            next={dateIdx < dates.length - 1 ? nextReport : null}
            setViewport={setViewport}
            viewport={viewport}
          />
        )}

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
  const data = await getData()

  return {
    data,
    dates: uniq(data.filter(r => r.code === 'FRA').map(r => r.date)).sort()
  }
}

export default MainPage
