import React, {useState, useContext, useEffect} from 'react'
import {FileText, Map, Layout} from 'react-feather'

import allTransferts from '../../transferts.json'

import theme from '../../styles/theme'
import colors from '../../styles/colors'

import {AppContext, ThemeContext} from '../../pages'

import Scrollable from '../scrollable'
import TransfertInformations from '../transfert-informations'

import TransfertMap from '../react-map-gl/transfert-map'
import TransfertTable from '../transfert-table'

export const TransfertContext = React.createContext()

const VIEWS = {
  table: (
    <Scrollable>
      <TransfertTable />
    </Scrollable>
  ),
  map: <TransfertMap />,
  informations: (
    <Scrollable>
      <TransfertInformations />
    </Scrollable>
  )
}

const MobileTransfert = () => {
  const [selectedView, setSelectedView] = useState('map')

  const app = useContext(AppContext)
  const theme = useContext(ThemeContext)

  const handleClick = view => {
    app.setSelectedLocation(null)
    setSelectedView(view)
  }

  return (
    <>
      {VIEWS[selectedView]}

      <div className='view-selector'>
        <div className={`${selectedView === 'table' ? 'selected' : ''}`} onClick={() => handleClick('table')}>
          <Layout size={32} color={selectedView === 'table' ? theme.primary : colors.black} />
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

const DesktopTransfert = () => {
  return (
    <>
      <div className='menu'>
        <Scrollable>
          <>
            <TransfertTable />
            <TransfertInformations />
          </>
        </Scrollable>
      </div>

      <div className='map'>
        <TransfertMap />
      </div>

      <style jsx>{`
        .menu {
          z-index: 1;
          display: flex;
          flex-direction: column;
          max-width: ${theme.menuWidth};
          box-shadow: 0 1px 4px ${colors.lightGrey};
        }

        .map {
          display: flex;
          flex: 1;
          flex-direction: column;
          height: 100%;
        }
      `}</style>
    </>
  )
}

const Transfert = props => {
  const {date, isMobileDevice} = useContext(AppContext)

  const [transferts, setTransferts] = useState(allTransferts)
  const [selectedTransferts, setSelectedTransferts] = useState(null)

  const Component = isMobileDevice ? MobileTransfert : DesktopTransfert

  useEffect(() => {
    setTransferts(allTransferts.filter(({fin_transfert}) => fin_transfert < date))
  }, [date])

  return (
    <TransfertContext.Provider value={{transferts, selectedTransferts, setSelectedTransferts}}>
      <Component {...props} />
    </TransfertContext.Provider>
  )
}

export default Transfert
