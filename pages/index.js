import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {groupBy, uniq, indexOf} from 'lodash'

import {getData} from '../lib/api'

import centers from '../centers.json'

import Page from '../layouts/main'

import Menu from '../components/menu'
import ReactMapGl from '../components/react-map-gl'

import theme from '../styles/theme'
import colors from '../styles/colors'

import {previousDates} from '../lib/dates'

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 5
}

const MainPage = ({data, dates}) => {
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
            history: byCode[code].filter(r => previousDates(date, r.date))
          }
        }
      }).filter(i => Boolean(i))
    }
  }, [date, data])

  useEffect(() => {
    const franceReport = getFranceReport()
    setFranceReport(franceReport)

    const regionsReport = getRegionsReport()
    setRegionsReport(regionsReport)
  }, [date, getFranceReport, getRegionsReport])

  useEffect(() => {
    const mobileWidth = theme.mobileDisplay.split('px')[0]
    if (window.innerWidth < mobileWidth) {
      const {latitude, longitude} = viewport
      setViewport({
        latitude,
        longitude,
        zoom: 4.3
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page title='Tableau de bord de suivi de l’épidémie de nouveau coronavirus'>
      <div className='main-page-container'>
        <div className='menu'>
          <Menu
            date={date}
            report={franceReport}
            previousReport={dateIdx > 0 ? previousReport : null}
            nextReport={dateIdx < dates.length - 1 ? nextReport : null}
          />
        </div>
        <div className='map'>
          <ReactMapGl
            viewport={viewport}
            date={date}
            regions={regionsReport}
            onViewportChange={setViewport}
          />
        </div>
      </div>
      <style jsx>{`
        .main-page-container {
          position: absolute;
          display: flex;
          height: 100%;
          width: 100%;
        }

        .menu {
          flex: 1;
          z-index: 1;
          max-width: 400px;
          box-shadow: 0 1px 4px ${colors.lightGrey};
        }

        .map {
          flex:1;
          height: 100%;
        }

        @media (max-width: ${theme.mobileDisplay}) {
          .main-page-container {
            flex-direction: column-reverse;
          }

          .menu {
            flex: 0;
            height: 40%;
            max-width: none;
          }
        }
        `}</style>
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
