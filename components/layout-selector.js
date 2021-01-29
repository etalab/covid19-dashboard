import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Maximize2} from 'react-feather'

import {AppContext, ThemeContext} from '../pages'

import SelectInput from './select-input'

import {AIDES_ENTREPRISES_URL} from './layouts/entreprises'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

const MobileLayoutSelector = ({selected, layouts, handleSelect}) => {
  const {isIframe} = useContext(AppContext)
  const layoutsOptions = isIframe ? [...layouts, {id: 'quitIframe', label: 'Passer en plein écran'}] : layouts

  return (
    <SelectInput
      selected={{label: selected.label, value: selected.id}}
      options={layoutsOptions.map(({label, id}) => ({label, value: id}))}
      handleSelect={({value}) => {
        if (value === 'quitIframe') {
          window.open(SITE_URL)
        } else {
          handleSelect(layouts.find(({id}) => {
            return id === value
          }))
        }
      }}
    />
  )
}

MobileLayoutSelector.propTypes = {
  selected: PropTypes.object.isRequired,
  layouts: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}

const TabletLayoutSelector = ({selected, layouts, handleSelect}) => {
  const {isIframe} = useContext(AppContext)
  const layoutsOptions = isIframe ? [...layouts, {id: 'quitIframe', label: 'Passer en plein écran'}] : layouts

  return (
    <div className='layout-selector-container'>
      <SelectInput
        selected={{label: selected.label, value: selected.id}}
        options={layoutsOptions.map(({label, id}) => ({label, value: id}))}
        handleSelect={({value}) => {
          if (value === 'quitIframe') {
            window.open(SITE_URL)
          } else {
            handleSelect(layouts.find(({id}) => {
              return id === value
            }))
          }
        }}
      />
      <style jsx>{`
        .layout-selector-container {
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
          }
      `}</style>
    </div>
  )
}

TabletLayoutSelector.propTypes = {
  selected: PropTypes.object.isRequired,
  layouts: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}

const DesktopLayoutSelector = ({selected, layouts, handleSelect}) => {
  const {isIframe, selectedLayout} = useContext(AppContext)
  const themeContext = useContext(ThemeContext)

  return (
    <div className='layout-selector-container'>
      <div className='nav'>
        {layouts.map(layout => (
          <div
            key={layout.id}
            className={`layout ${selected.id === layout.id ? 'selected' : ''}`}
            onClick={() => handleSelect(layout)}
          >
            {layout.label}
          </div>
        ))}
      </div>

      {isIframe && (
        <a href={selectedLayout.id === 'entreprises' ? AIDES_ENTREPRISES_URL : SITE_URL} className='maximize' target='_top'><Maximize2 style={{verticalAlign: 'middle'}} /></a>
      )}

      <style jsx>{`
        .layout-selector-container {
          display: flex;
          padding: 0.2em 1em;
          flex: 1;
          background-color: ${themeContext.primary};
          justify-content: center;
          align-items: center;
        }

        .nav {
          display: flex;
        }

        .layout {
          padding: 0.8em 0.5em;
          font-size: smaller;
          list-style: none;
          text-align: center;
          background-color: ${themeContext.secondary};
          color: #fff;
        }

        .layout:first-child {
          border-bottom-left-radius: 4px;
          border-top-left-radius: 4px;
        }

        .layout:last-child {
          border-bottom-right-radius: 4px;
          border-top-right-radius: 4px;
        }

        .layout.selected {
          color: ${themeContext.primary};
          background-color: #fff;
        }

        .layout:hover {
          cursor: pointer;
          background-color: ${themeContext.alt};
          color: #fff;
        }

        .maximize {
          color: #fff;
          margin: 0.4em;
          padding: 0.4em;
        }

        .maximize:hover {
          cursor: pointer;
          color: ${themeContext.primary};
          background-color: #fff;
          border-radius: 4px;
        }

        @media (max-width: 1370px) {
          .layout {
            font-size: small;
          }
        }

        @media (max-width: 1260px) {
          .layout {
            padding: .2em .8em;
          }
        }
        `}</style>
    </div>
  )
}

DesktopLayoutSelector.propTypes = {
  selected: PropTypes.object.isRequired,
  layouts: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}

const LayoutSelector = () => {
  const {isMobileDevice, isTabletDevice, selectedLayout, layouts, setSelectedLayout} = useContext(AppContext)
  const Component = isMobileDevice ? MobileLayoutSelector : (isTabletDevice ? TabletLayoutSelector : DesktopLayoutSelector)

  return <Component selected={selectedLayout} layouts={layouts} handleSelect={setSelectedLayout} />
}

export default LayoutSelector
