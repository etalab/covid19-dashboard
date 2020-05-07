import React, {useContext} from 'react'

import {AppContext} from '../../../pages'

import colors from '../../../styles/colors'
import PieChartValues from '../../pie-chart-values'
import {SyntheseContext} from '.'

const SyntheseStatistics = () => {
  const {isMobileDevice} = useContext(AppContext)
  const {synthese} = useContext(SyntheseContext)

  const title = 'Répartition des départements selon leur couleur'

  const indicateurVert = synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'vert')).length
  const indicateurOrange = synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'orange')).length
  const indicateurRouge = synthese.filter((({indicateurSynthese}) => indicateurSynthese === 'rouge')).length

  const data = [
    {
      label: 'vert',
      value: indicateurVert,
      color: colors.green
    },
    {
      label: 'orange',
      value: indicateurOrange,
      color: colors.orange
    },
    {
      label: 'rouge',
      value: indicateurRouge,
      color: colors.red
    }
  ].filter(i => i.value > 0)

  const pieColors = data.map(i => i.color)

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
