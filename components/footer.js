import React from 'react'
import {GitHub} from 'react-feather'

import theme from '../styles/theme'
import colors from '../styles/colors'

const Footer = () => {
  return (
    <div className='menu-footer'>
      <div>
        <a target='_top' href='https://github.com/opencovid19-fr/dashboard'>
          <GitHub style={{verticalAlign: 'middle'}} />
        </a>
      </div>

      <style jsx>{`
        .menu-footer {
          display: flex;
          background: ${colors.darkBlue};
          padding: 1em;
        }

        .menu-footer div {
          display: flex;
          flex: 1;
        }

        a {
          color: #fff;
          width: 100%;
          text-align: center;
        }

        @media (max-width: ${theme.mobileDisplay}) {
          .menu-footer {
            padding: 0.5em 1em;
          }
        }
      `}</style>
    </div>
  )
}

export default Footer
