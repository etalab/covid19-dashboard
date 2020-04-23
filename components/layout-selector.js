import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Maximize2} from 'react-feather'

import {AppContext, ThemeContext} from '../pages'

import SelectInput from './select-input'

const SITE_URL = process.env.SITE_URL

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

const DesktopLayoutSelector = ({selected, layouts, handleSelect}) => {
  const {isIframe} = useContext(AppContext)
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
        <a href={SITE_URL} className='maximize' target='_top'><Maximize2 style={{verticalAlign: 'middle'}} /></a>
      )}

      <style jsx>{`
        .layout-selector-container {
          display: flex;
          flex: 1;
          padding: 0.5em 0;
          background-color: ${themeContext.primary};
          justify-content: space-between;
          align-items: center;
        }

        .nav {
          display: flex;
          align-items: center;
        }

        .layout {
          padding: 0.5em;
          margin: 0 0.4em;
          background-color: ${themeContext.secondary};
          color: #fff;
          border-radius: 4px;
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
  const {isMobileDevice, selectedLayout, layouts, setSelectedLayout} = useContext(AppContext)
  const Component = isMobileDevice ? MobileLayoutSelector : DesktopLayoutSelector

  return <Component selected={selectedLayout} layouts={layouts} handleSelect={setSelectedLayout} />
}

export default LayoutSelector
