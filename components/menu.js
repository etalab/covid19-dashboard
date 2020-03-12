import React from 'react'
import PropTypes from 'prop-types'

import colors from '../styles/colors'

import Counter from './counter'

import theme from '../styles/theme'

const formatDate = isoString => {
  const date = new Date(isoString)

  return date.toLocaleDateString()
}

const Menu = ({date, donneesNationales}) => {
  const {casConfirmes, deces} = donneesNationales
  const formatedDate = formatDate(date)

  return (
    <div className='menu-container'>
      <div className='menu-header'>
        <h2>COVID19</h2>
      </div>

      <div className='content'>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula, nunc luctus pellentesque tempor, ante purus tincidunt mauris, ut ultricies metus mauris eget neque. Integer posuere tempor ullamcorper. Maecenas maximus velit sed magna rutrum, in posuere nisi sodales. Mauris laoreet dignissim odio, eget lacinia libero iaculis quis.
        </p>

        <div className='stats'>
          <div className='counters'>
            <Counter value={casConfirmes} label='cas confirmés' color='orange' />
            <Counter value={deces} label='décès' color='red' />
          </div>
        </div>
      </div>

      <div className='menu-footer'>
        <div>Mise à jour le {formatedDate}</div>
      </div>
      <style jsx>{`
        .menu-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }

        .menu-container > div {
          padding: 1em;
        }

        .menu-container .menu-header {
          text-align: center;
          box-shadow: 0 1px 4px ${colors.lightGrey};
        }

        .menu-container .content {
          flex: 1;
          overflow-y: scroll;
        }

        .menu-container .stats {
          flex: 1;
        }

        .counters {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .menu-container .menu-footer {
          text-align: center;
          background: ${colors.lightGrey};
        }

        @media (max-width: ${theme.mobileDisplay}) {
          .menu-container .menu-header {
            font-size: small;
          }

          .menu-container > div {
            padding: 0.5em 1em;
          }

          .menu-container h2 {
            margin: 0.2em;
          }
        }
    `}</style>
    </div>
  )
}

Menu.propTypes = {
  date: PropTypes.string.isRequired,
  donneesNationales: PropTypes.shape({
    casConfirmes: PropTypes.number.isRequired,
    deces: PropTypes.number.isRequired
  }).isRequired
}

export default Menu
