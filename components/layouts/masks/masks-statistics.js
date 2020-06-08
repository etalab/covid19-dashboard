import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {ThemeContext} from '../../../pages'

import colors from '../../../styles/colors'

import MasksTypes from './masks-types'

const CompaniesList = ({title, companies}) => {
  const themeContext = useContext(ThemeContext)
  return (
    <div className='companies-list'>
      <div className='header'>
        <h3>{title}</h3>
      </div>
      <div className='subheader'>
        <div>Entreprises</div>
      </div>
      <div className='list'>
        {companies.map(({nom}) => (
          <div key={nom} className='company'>
            <div>{nom}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
          .companies-list {
            border: 1px solid ${colors.lightGrey};
            border-radius: 4px;
            padding: 1em;
            margin-bottom: 1em;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .subheader {
            margin-bottom: 0.2em;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid ${themeContext.primary};
          }

          .company {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 1.2em;
            padding: 0.2em 0.2em;
          }

          .company:nth-child(even) {
            background-color: ${colors.lighterGrey};
          }

          .company:nth-child(odd) {
            background-color: ${colors.lightGrey};
          }

          .align-right {
            text-align: right;
          }
        `}</style>
    </div>
  )
}

CompaniesList.propTypes = {
  title: PropTypes.string.isRequired,
  companies: PropTypes.array.isRequired
}

const MasksStatistics = () => (
  <div className='masks-statistics'>
    <MasksTypes />
    <style jsx>{`
      h3 {
        display: flex;
        justify-content: center;
      }

      .masks-statistics {
        margin: 0 0.5em;
      }
    `}</style>
  </div>
)

export default MasksStatistics
