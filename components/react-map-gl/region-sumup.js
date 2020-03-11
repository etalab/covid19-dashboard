import React from 'react'
import PropTypes from 'prop-types'

const RegionSumup = ({nom, casConfirmes}) => (
  <div className='sumup-container'>
    <div className='title'>{nom}</div>
    <div>{casConfirmes} cas confirmés</div>
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

RegionSumup.propTypes = {
  nom: PropTypes.string.isRequired,
  casConfirmes: PropTypes.number.isRequired
}

export default RegionSumup
