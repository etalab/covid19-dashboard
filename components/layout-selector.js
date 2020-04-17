import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {AppContext, ThemeContext} from '../pages'

import SelectInput from './select-input'

const MobileLayoutSelector = ({selected, layouts, handleSelect}) => {
  return (
    <SelectInput
      selected={{label: selected.label, value: selected.id}}
      options={layouts.map(({label, id}) => ({label, value: id}))}
      handleSelect={({value}) => handleSelect(layouts.find(({id}) => {
        return id === value
      }))}
    />
  )
}

MobileLayoutSelector.propTypes = {
  selected: PropTypes.object.isRequired,
  layouts: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}

const DesktopLayoutSelector = ({selected, layouts, handleSelect}) => {
  const theme = useContext(ThemeContext)

  return (
    <div className='layout-selector-container'>
      {layouts.map(layout => (
        <div
          key={layout.id}
          className={`layout ${selected.id === layout.id ? 'selected' : ''}`}
          onClick={() => handleSelect(layout)}
        >
          {layout.label}
        </div>
      ))}

      <style jsx>{`
        .layout-selector-container {
          display: flex;
          justify-content: space-around;
          padding: 0.5em 0;
          background-color: ${theme.primary};
        }

        .layout {
          padding: 0.5em;
          margin: 0 0.4em;
          background-color: ${theme.secondary};
          color: #fff;
          border-radius: 4px;
        }

        .layout.selected {
          color: ${theme.primary};
          background-color: #fff;
        }

        .layout:hover {
          cursor: pointer;
          background-color: ${theme.alt};
          color: #fff;
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
