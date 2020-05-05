import React, {useContext} from 'react'

import {AppContext} from '../../../pages'

import colors from '../../../styles/colors'
import PieChartValues from '../../pie-chart-values'
import {SyntheseContext} from '.'

const SyntheseStatistics = () => {
  const {isMobileDevice} = useContext(AppContext)
  const {synthese} = useContext(SyntheseContext)

  const title = 'Répartition du classement des départements'

  const indicateurVert = synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'vert')).length
  const indicateurOrange = synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'orange')).length
  const indicateurRouge = synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'rouge')).length

  const data = [
    {
      label: 'vert',
      value: indicateurVert
    },
    {
      label: 'orange',
      value: indicateurOrange
    },
    {
      label: 'rouge',
      value: indicateurRouge
    }
  ]

  const pieColors = [colors.green, colors.orange, colors.red]

  return (
    <div className='statistics-container'>
      <PieChartValues
        title={title}
        data={data}
        colors={pieColors}
        height={isMobileDevice ? 200 : 130} />
      <style jsx>{`
        .statistics-container {
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  )
}

export default SyntheseStatistics
