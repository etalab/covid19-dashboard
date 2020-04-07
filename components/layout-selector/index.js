import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {AppContext} from '../pages'

import Desktop from './desktop-layout-selector'
import Mobile from './mobile-layout-selector'

const LayoutSelector = props => {
  const {isMobileDevice} = useContext(AppContext)
  const Component = isMobileDevice ? Mobile : Desktop

  return <Component {...props} />
}

LayoutSelector.propTypes = {
  selected: PropTypes.string.isRequired,
  layouts: PropTypes.array.isRequired,
  selectLayout: PropTypes.func.isRequired
}

export default LayoutSelector
