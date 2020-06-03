import React, {useContext} from 'react'
import {sum, round, keyBy} from 'lodash'
import moment from 'moment'

import {AppContext} from '../../../pages'

import colors from '../../../styles/colors'

import masksProduction from '../../../public/data/masks-production.json'

import MasksProductionChart from '../../charts/masks-production-chart'
import PieChartPercent from '../../pie-chart-percent'
import Counter from '../../counter'
import theme from '../../../styles/theme'

const MasksTypes = () => {
  const {date, isMobileDevice} = useContext(AppContext)

  const selectedWeek = parseInt(moment(date).format('W'), 10)

  const productionByWeek = keyBy(masksProduction, ({date}) => date.replace('Semaine ', ''))
  const productionJson = Object.keys(productionByWeek).map(r => productionByWeek[r])

  const chirurgicauxData = [
    {
      total: round(sum(masksProduction.map(r => r.chirurgicauxFr)), 2),
      label: 'Production Française',
      color: 'darkBlue',
      details: 'Nombre total de masque produit en France (exprimé en million)'
    },
    {
      total: round(sum(masksProduction.map(r => r.chirurgicauxChine)), 2),
      label: 'Import Chine',
      color: 'lightBlue',
      details: 'Nombre total de masque importé de Chine (exprimé en million)'
    },
    {
      total: round(sum(masksProduction.map(r => r.chirurgicauxDistribution)), 2),
      label: 'Distribution',
      color: 'lighterBlue',
      details: 'Nombre total de masque distribués aux GHT et pharmacies (exprimé en million)'
    }
  ]

  const ffp2Data = [
    {
      total: round(sum(masksProduction.map(r => r.ffp2Fr)), 2),
      label: 'Production Française',
      color: 'darkBlue',
      details: 'Nombre total de masque produit en France (exprimé en million)'
    },
    {
      total: round(sum(masksProduction.map(r => r.ffp2Chine)), 2),
      label: 'Import Chine',
      color: 'lightBlue',
      details: 'Nombre total de masque importé de Chine (exprimé en million)'
    },
    {
      total: round(sum(masksProduction.map(r => r.ffp2Distribution)), 2),
      label: 'Distribution',
      color: 'lighterBlue',
      details: 'Nombre total de masque distribués aux GHT et pharmacies (exprimé en million)'
    }
  ]

  return (
    <div>
      <h3>Achat des masques à l’étranger et en France</h3>
      <Counter
        value={4.2}
        label='Masques achetés'
        color='darkBlue'
        details='Total des achats à l’étranger et en France (exprimé en milliard)'
      />
      <h4>Masques chirurgicaux</h4>
      <div className='masks-container'>
        <div>
          <PieChartPercent
            data={chirurgicauxData.map(r => r.total)}
            labels={chirurgicauxData.map(r => r.label)}
            colors={chirurgicauxData.map(r => colors[r.color])}
            height={isMobileDevice ? 200 : 180}
          />
        </div>
        <div>
          <div className='counters chirurgicaux-counter'>
            {chirurgicauxData.map(counter => (
              <Counter
                key={counter.label}
                value={counter.total}
                label={counter.label}
                color={counter.color}
                details={counter.details}
              />
            ))}
          </div>
        </div>
        <div className='chirurgicaux-chart'>
          <MasksProductionChart height={isMobileDevice ? 190 : 180} data={productionJson.filter(r => selectedWeek >= parseInt(r.date.replace('Semaine ', ''), 10))} type='chirurgicaux' />
        </div>
      </div>
      <h4>Masques FFP2</h4>
      <div className='masks-container ffp2-container'>
        <div>
          <PieChartPercent
            data={ffp2Data.map(r => r.total)}
            labels={ffp2Data.map(r => r.label)}
            colors={ffp2Data.map(r => colors[r.color])}
            height={isMobileDevice ? 200 : 180}
          />
        </div>
        <div>
          <div className='counters ffp2-counter'>
            {ffp2Data.map(counter => (
              <Counter
                key={counter.label}
                value={counter.total}
                label={counter.label}
                color={counter.color}
                details={counter.details}
              />
            ))}
          </div>
        </div>
        <div className='ffp2-chart'>
          <MasksProductionChart height={isMobileDevice ? 190 : 180} data={productionJson.filter(r => selectedWeek >= parseInt(r.date.replace('Semaine ', ''), 10))} type='ffp2' />
        </div>
      </div>
      <style jsx>{`
        h3, h4 {
          text-align: center;
        }

        .masks-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          margin-right: 2em;
        }

        .charts-desktop {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          margin: 0.2em 0;
        }

        .counters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          border-bottom: 1px solid ${colors.white};
        }

        .ffp2-container {
          margin-bottom: 1em;
        }

        @media (max-width: ${theme.mobileDisplay}) {
          .masks-container {
            margin: 0;
            grid-template-columns: 1fr;
          }
      `}</style>
    </div>
  )
}

export default MasksTypes
