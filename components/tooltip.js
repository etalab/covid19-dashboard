import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import {Info} from 'react-feather'

import colors from '../styles/colors'

const Tooltip = ({tip, id, icon}) => (
  <span className='tooltip'>
    <span className='icon'>
      {icon ? (
        <span data-tip={tip} data-for={id}>{icon}</span>
      ) : (
        <Info size={12} data-tip={tip} data-for={id} />
      )}
      <ReactTooltip
        id={id}
        backgroundColor={colors.black}
        arrowColor='rgba(0, 0, 0, 0)'
        multiline
        overridePosition={(
          {left, top}, currentEvent, currentTarget, node) => {
          const d = document.documentElement
          left = Math.min(d.clientWidth - node.clientWidth, left)
          top = Math.min(d.clientHeight - node.clientHeight, top)
          left = Math.max(0, left)
          top = Math.max(0, top)
          return {top, left}
        }}
      />
    </span>
    <style jsx>{`
      .tooltip {
        padding: .4em;
        position: relative;
      }

      .icon {
        position: absolute;
        top: 0;
      }

      .icon:hover {
        cursor: help;
      }
      `}</style>
  </span>
)

Tooltip.defaultProps = {
  icon: null
}

Tooltip.propTypes = {
  tip: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  icon: PropTypes.string
}

export default Tooltip
