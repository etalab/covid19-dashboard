import React from 'react'
import PropTypes from 'prop-types'

import SelectInput from '../select-input'

const MobileLayoutSelector = ({selected, layouts, selectLayout}) => {
  return (
    <SelectInput
      selected={{label: selected, value: selected}}
      options={layouts.map(layout => ({label: layout, value: layout}))}
      handleSelect={({value}) => selectLayout(value)}
    />
  )
}

MobileLayoutSelector.propTypes = {
  selected: PropTypes.string.isRequired,
  layouts: PropTypes.array.isRequired,
  selectLayout: PropTypes.func.isRequired
}

export default MobileLayoutSelector
