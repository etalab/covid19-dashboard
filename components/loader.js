import React from 'react'
import PropTypes from 'prop-types'

import colors from '../styles/colors'

const Loader = ({size}) => (
  <div className={`loader ${size}`}>
    <style jsx>{`
      .loader {
        border-radius: 50%;
        animation: spin 2s linear infinite;
      }

      .small {
        border: 2px solid ${colors.white};
        border-top: 2px solid ${colors.blue};
        width: 20px;
        min-width: 20px;
        height: 20px;
      }

      .regular {
        border: 4px solid ${colors.white};
        border-top: 4px solid ${colors.blue};
        width: 40px;
        height: 40px;
      }


      .big {
        border: 5px solid ${colors.white};
        border-top: 5px solid ${colors.blue};
        width: 60px;
        height: 60px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

Loader.propTypes = {
  size: PropTypes.oneOf([
    'small',
    'regular',
    'big'
  ])
}

Loader.defaultProps = {
  size: 'regular'
}

export default Loader
