import React, { useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import {getData} from '../lib/api'

import Page from '../layouts/main'

import Menu from '../components/menu'
import ReactMapGl from '../components/react-map-gl'

import theme from '../styles/theme'
import colors from '../styles/colors'

import {getRegionCenter} from '../lib/regions'

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 5
}

const MainPage = ({data, regionsData}) => {
  const [viewport, setViewport] = useState(defaultViewport)

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
    <Page>
      <div className='main-page-container'>
        <div className='menu'>
          <Menu {...data} />
        </div>
        <div className='map'>
          <ReactMapGl
            data={regionsData}
            viewport={viewport}
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
  data: PropTypes.object.isRequired,
  regionsData: PropTypes.object.isRequired
}

MainPage.getInitialProps = async () => {
  const data = await getData()
  const regionsData = {
    type: 'FeatureCollection',
    features: data.donneesRegionales.map(region => {
      const {code} = region
      const feature = getRegionCenter(code)
      feature.properties = {...region}

      return feature
    })
  }

  return {
    data,
    regionsData
  }
}

export default MainPage
