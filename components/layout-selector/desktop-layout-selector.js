import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {ThemeContext} from '../../pages'

const DesktopLayoutSelector = ({selected, layouts, selectLayout}) => {
  const theme = useContext(ThemeContext)

  return (
    <div className='layout-selector-container'>
      {layouts.map(layout => (
        <div
          key={layout}
          className={`layout ${selected === layout ? 'selected' : ''}`}
          onClick={() => selectLayout(layout)}
        >
          {layout}
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
          color: ${theme.primary};
          background-color: #fff;
          border-radius: 4px;
        }

        .layout.selected {
          background-color: ${theme.secondary};
          color: #fff;
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
  selected: PropTypes.string.isRequired,
  layouts: PropTypes.array.isRequired,
  selectLayout: PropTypes.func.isRequired
}

export default DesktopLayoutSelector
