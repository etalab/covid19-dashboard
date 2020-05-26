import React from 'react'
import PropTypes from 'prop-types'

import colors from '../styles/colors'

const Button = ({title, onClick, isMobileDevice}) => (
  <div className='mixed-chart-container'>
    <div className='mixed-chart-button' onClick={onClick}>{title}</div>
    <style jsx>{`
    .mixed-chart-container {
      border-bottom: 1px solid ${colors.darkBlue};
      border-right: 1px solid ${colors.darkBlue};
      margin: 0.5em ${isMobileDevice ? '0.2em' : '1em'};
    }

    .mixed-chart-button {
      display: block;
      font-weight: bold;
      height: 100%;
      text-align: center;
      background-color: ${colors.white};
      color: ${colors.darkBlue};
      padding: 0.4em;
      font-size: .7em;
      letter-spacing: .1em;
      border: 1px solid ${colors.darkBlue};
      text-transform: uppercase;
      transform: translate(-.1em, -.1em);
      transition: transform .1s ease-out;
    }

    .mixed-chart-button:hover {
      cursor: pointer;
      color: ${colors.white};
      background-color: ${colors.darkBlue};
      transform: translate(0px, 0px);
    }
    `}</style>
  </div>
)

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isMobileDevice: PropTypes.bool.isRequired
}

export default Button
