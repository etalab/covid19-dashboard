import React from 'react'
import PropTypes from 'prop-types'

import ConfirmedChart from '../confirmed-chart'

const RegionSumup = ({nom, casConfirmes, deces, data}) => {
  return (
    <div className='sumup-container'>
      <div className='title'>{nom}</div>
      <div>
        {casConfirmes} cas confirmés
        {deces && deces > 0 ? <span> (dont {deces} décès)</span> : null}
      </div>

      <ConfirmedChart data={data} height={240} />

      <style jsx>{`
      .sumup-container {
        font-size: larger;
      }

      .title {
        font-weight: bold;
      }
    `}</style>
    </div>
  )
}

RegionSumup.defaultProps = {
  deces: null
}

RegionSumup.propTypes = {
  nom: PropTypes.string.isRequired,
  casConfirmes: PropTypes.number.isRequired,
  deces: PropTypes.number,
  data: PropTypes.array.isRequired
}

export default RegionSumup
