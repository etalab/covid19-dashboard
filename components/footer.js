import React, {useContext} from 'react'
import {GitHub} from 'react-feather'

import theme from '../styles/theme'
import {ThemeContext} from '../pages'

const Footer = () => {
  const Theme = useContext(ThemeContext)

  return (
    <div className='menu-footer'>
      <div>
        <a href='https://github.com/opencovid19-fr/dashboard'>
          <GitHub style={{verticalAalign: 'middle'}} />
        </a>
      </div>

      <style jsx>{`
        .menu-footer {
          display: flex;
          background: ${Theme.primary};
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
