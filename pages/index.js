import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {groupBy, uniq, indexOf} from 'lodash'

import {getData} from '../lib/api'

import centers from '../centers.json'

import Page from '../layouts/main'

import Menu from '../components/menu'
import ReactMapGl from '../components/react-map-gl'
import ConfirmedChart from '../components/confirmed-chart'
import Statistics from '../components/statistics'
import Description from '../components/descritpion'

import DateNav from '../components/date-nav'

import theme from '../styles/theme'
import colors from '../styles/colors'

import {previousDates} from '../lib/dates'
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
            history: byCode[code].filter(r => previousDates(date, r.date))
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
            prev={previousReport}
            next={nextReport}
            setViewport={setViewport}
            viewport={viewport}
          />
        ) : (
          <>
            <div className='menu'>
              <Menu
                date={date}
                previousReport={dateIdx > 0 ? previousReport : null}
                nextReport={dateIdx < dates.length - 1 ? nextReport : null}
              >
                <DateNav date={date} prev={previousReport} next={nextReport} />
                <>
                  <Description />

                  <Statistics report={franceReport} />

                  {franceReport && franceReport.history && (
                    <ConfirmedChart data={franceReport.history.filter(r => previousDates(date, r.date))} height={300} />
                  )}
                </>
              </Menu>
            </div>

            <div className='map'>
              <ReactMapGl
                viewport={viewport}
                date={date}
                regions={regionsReport}
                onViewportChange={setViewport}
              />
            </div>
          </>
        )}

        <style jsx>{`
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
                .map {
                  height: 60%;
                }

                .menu {
                  flex: 0;
                  height: 40%;
                  max-width: none;
                  box-shadow: 0 -1px 4px ${colors.lightGrey};
                }
              }


          .main-page-container {
            position: absolute;
            display: flex;
            height: 100%;
            width: 100%;
          }

          @media (max-width: ${theme.mobileDisplay}) {
            .main-page-container {
              flex-direction: column-reverse;
            }
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
