import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {ThemeContext} from '../pages'

const LayoutSelector = ({selected, layouts, selectLayout}) => {
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
          padding: 0.5em;
        }

        .layout {
          padding: 0.5em;
          color: white;
          background-color: ${theme.primary};
          border-radius: 4px;
        }

        .layout.selected {
          background-color: ${theme.secondary};
        }

        .layout:hover {
          cursor: pointer;
          background-color: ${theme.alt};
        }
        `}</style>
    </div>
  )
}

LayoutSelector.propTypes = {
  selected: PropTypes.string.isRequired,
  layouts: PropTypes.array.isRequired,
  selectLayout: PropTypes.func.isRequired
}

export default LayoutSelector
