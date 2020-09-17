import React from 'react'
import PropTypes from 'prop-types'

const Scrollable = ({children}) => {
  return (
    <div className='scrollable-container'>
      {children}

      <style jsx>{`
        .scrollable-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          background-color: #fff;
        }
    `}</style>
    </div>
  )
}

Scrollable.propTypes = {
  children: PropTypes.node.isRequired
}

export default Scrollable
