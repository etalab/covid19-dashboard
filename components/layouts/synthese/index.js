import React, {useState, useContext, useEffect} from 'react'
import {FileText, Map, BarChart2} from 'react-feather'

import theme from '../../../styles/theme'
import colors from '../../../styles/colors'

import {getReport} from '../../../lib/data'

import {AppContext, ThemeContext} from '../../../pages'

import Scrollable from '../../scrollable'

import SyntheseInformations from './synthese-informations'
import SyntheseStatistics from './synthese-statistics'
import SyntheseMap from './synthese-map'

export const SyntheseContext = React.createContext()

const SyntheseMobile = () => {
  const [selectedView, setSelectedView] = useState('map')

  const app = useContext(AppContext)
  const theme = useContext(ThemeContext)

  const views = {
    map: (
      <SyntheseMap />
    ),
    stats: (
      <Scrollable>
        <SyntheseStatistics />
      </Scrollable>
    ),
    informations: (
      <Scrollable>
        <SyntheseInformations />
      </Scrollable>
    )
  }

  const handleClick = view => {
    app.setSelectedLocation('FRA')
    setSelectedView(view)
  }

  return (
    <>
      <Scrollable>
        {views[selectedView]}
      </Scrollable>

      <div className='view-selector'>
        <div className={`${selectedView === 'stats' ? 'selected' : ''}`} onClick={() => handleClick('stats')}>
          <BarChart2 size={32} color={selectedView === 'stats' ? theme.primary : colors.black} />
        </div>
        <div className={`${selectedView === 'map' ? 'selected' : ''}`} onClick={() => handleClick('map')}>
          <Map size={32} color={selectedView === 'map' ? theme.primary : colors.black} />
        </div>
        <div className={`${selectedView === 'informations' ? 'selected' : ''}`} onClick={() => handleClick('informations')}>
          <FileText size={32} color={selectedView === 'informations' ? theme.primary : colors.black} />
        </div>
      </div>

      <style jsx>{`
        .view-selector {
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          box-shadow: 0 -1px 4px ${colors.lightGrey};
        }

        .view-selector > div {
          padding: 0.5em;
          margin: auto;
          margin-bottom: -4px;
        }

        .view-selector > div.selected {
          border-top: 4px solid ${theme.primary};
        }
      `}</style>
    </>
  )
}

const SyntheseDesktop = () => {
  return (
    <>
      <div className='menu'>
        <Scrollable>
          <>
            <SyntheseStatistics />
            <SyntheseInformations />
          </>
        </Scrollable>
      </div>

      <div className='map-container'>
        {/* <div className='info'>
          <div className='legends'>
            <div className='legend'>Activité limitée du virus <div className=' color green' /></div>
            <div className='legend'>Activité importante du virus <div className=' color orange' /></div>
            <div className='legend'>Activité élevée du virus <div className=' color red' /></div>
          </div>
        </div> */}

        <SyntheseMap />
      </div>

      <style jsx>{`
        .menu {
          z-index: 1;
          display: flex;
          flex-direction: column;
          max-width: ${theme.menuWidth};
          box-shadow: 0 1px 4px ${colors.lightGrey};
        }

        .map-container {
          display: flex;
          flex: 1;
          position: relative;
        }

        .banner {
          margin: 0.5em;
          text-align: center;
        }

        .banner p {
          margin: 0.4em;
        }

        .banner a {
          color: #fff;
        }

        .info {
          z-index: 2;
          position: absolute;
          display: flex;
          flex-direction: column;
          margin: 0.5em;
          padding: 0.5em;
          background-color: #000000aa;
          border-radius: 4px;
          color: #fff;
        }

        .legend {
          display: grid;
          grid-template-columns: 1fr 40px;
          grid-gap: 1em;
          align-items: center;
        }

        .color {
          width: 40px;
          height: 20px;
        }

        .red {
          background-color: ${colors.red};
        }

        .orange {
          background-color: ${colors.orange};
        }

        .green {
          background-color: ${colors.green};
        }
        `}</style>
    </>
  )
}

const Synthese = props => {
  const {date, isMobileDevice} = useContext(AppContext)

  const [synthese, setSynthese] = useState([])

  const Component = isMobileDevice ? SyntheseMobile : SyntheseDesktop

  useEffect(() => {
    const getDeconfinmentData = async () => {
      const {history} = await getReport(date, 'DEP')
      setSynthese(history.map(dep => {
        return {
          ...dep,
          code: dep.code.split('-')[1]
        }
      }))
    }

    getDeconfinmentData()
  }, [date])

  return (
    <SyntheseContext.Provider value={{synthese}}>
      <Component {...props} />
    </SyntheseContext.Provider>
  )
}

export default Synthese
