import React from 'react'
import PropTypes from 'prop-types'
import {FileText, Map, BarChart} from 'react-feather'

import colors from '../styles/colors'
import theme from '../styles/theme'

const Menu = ({selectedView, selectView, children}) => {
  return (
    <div className='menu-container'>
      <div className='content'>
        {children}
      </div>

      <div className='view-selector'>
        <div className={`${selectedView === 'description' ? 'selected' : ''}`} onClick={() => selectView('description')}>
          <FileText />
        </div>
        <div className={`${selectedView === 'map' ? 'selected' : ''}`} onClick={() => selectView('map')}>
          <Map />
        </div>
        <div className={`${selectedView === 'stats' ? 'selected' : ''}`} onClick={() => selectView('stats')}>
          <BarChart />
        </div>
      </div>

      <div className='menu-footer'>
        <div>[<a href='https://github.com/opencovid19-fr/dashboard'>GitHub</a>]</div>
      </div>
      <style jsx>{`
        .menu-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background-color: #fff;
        }

        .menu-container .content {
          flex: 1;
          overflow-y: scroll;
        }

        .view-selector {
          display: none;
        }

        .view-selector > div {
          padding: 1em;
          margin: auto;
        }

        .view-selector > div.selected {
          border-top: 2px solid ${colors.blue};
        }

        .menu-container .menu-footer {
          text-align: center;
          background: ${colors.lightGrey};
          padding: 1em;
        }

        @media (max-width: ${theme.mobileDisplay}) {
          .menu-footer {
            padding: 0.5em 1em;
          }

          .view-selector {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            justify-content: center;
            align-items: center;
          }
        }
    `}</style>
    </div>
  )
}

Menu.defaultProps = {
  selectedView: null,
  selectView: null
}

Menu.propTypes = {
  selectedView: PropTypes.oneOf([
    'description', 'map', 'stats'
  ]),
  selectView: PropTypes.func,
  children: PropTypes.node.isRequired
}

export default Menu
