import React, {useContext} from 'react'
import {sum, round, keyBy} from 'lodash'

import {AppContext} from '../../../pages'

import colors from '../../../styles/colors'

import masksProduction from '../../../public/data/masks-production.json'

import theme from '../../../styles/theme'
import MasksProductionChart from '../../charts/masks-production-chart'
import PieChartPercent from '../../pie-chart-percent'
import Counter from '../../counter'

const MaskStatistics = () => {
  const {date, isMobileDevice} = useContext(AppContext)

  const masksProductionByWeek = keyBy(masksProduction, 'week')
  const masksProductionGroup = Object.keys(masksProductionByWeek).map(r => masksProductionByWeek[r])

  const productionMasquesChirurgicaux = [
    {
      total: round(sum(masksProduction.map(r => r.productionFRMasquesChirurgicaux)), 2),
      label: 'Production Française',
      color: 'darkBlue',
      details: 'Nombre total de masque produit en France (exprimé en million)'
    },
    {
      total: round(sum(masksProduction.map(r => r.importChineMasquesChirurgicaux)), 2),
      label: 'Import Chine',
      color: 'lightBlue',
      details: 'Nombre total de masque importé de Chine (exprimé en million)'
    },
    {
      total: round(sum(masksProduction.map(r => r.distributionMasquesChirurgicaux)), 2),
      label: 'Distribution',
      color: 'lighterBlue',
      details: 'Nombre total de masque distribués aux GHT et pharmacies (exprimé en million)'
    }
  ]

  const productionFFP2 = [
    {
      total: round(sum(masksProduction.map(r => r.productionFRFFP2)), 2),
      label: 'Production Française',
      color: 'darkBlue',
      details: 'Nombre total de masque produit en France (exprimé en million)'
    },
    {
      total: round(sum(masksProduction.map(r => r.importChineFFP2)), 2),
      label: 'Import Chine',
      color: 'lightBlue',
      details: 'Nombre total de masque importé de Chine (exprimé en million)'
    },
    {
      total: round(sum(masksProduction.map(r => r.distributionFFP2)), 2),
      label: 'Distribution',
      color: 'lighterBlue',
      details: 'Nombre total de masque distribués aux GHT et pharmacies (exprimé en million)'
    }
  ]

  const selectedWeek = date => {
    const d = new Date(date)
    const dayNumber = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNumber)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))

    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }

  return (
    <div>
      <h3>Achat des masques à l’étranger et en France</h3>
      <Counter
        value={4.2}
        label='Masques achetés'
        color='darkBlue'
        details='Total des achats à l’étranger et en France (exprimé en milliard)'
      />
      <div className='grid'>
        <div className='col'>
          <div>
            <h3>Masques chirurgicaux</h3>
            <div className='counters'>
              {productionMasquesChirurgicaux.map(counter => (
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
          <div className='pie-chart'>
            <PieChartPercent
              data={productionMasquesChirurgicaux.map(r => r.total)}
              labels={productionMasquesChirurgicaux.map(r => r.label)}
              colors={productionMasquesChirurgicaux.map(r => colors[r.color])}
              height={isMobileDevice ? 240 : 280}
            />
          </div>
          <div className='bar-chart'>
            <MasksProductionChart
              height={isMobileDevice ? 190 : 180}
              data={masksProductionGroup.filter(r => selectedWeek(date) >= r.week)}
              type='MasquesChirurgicaux'
            />
          </div>
        </div>
        <div className='col'>
          <div>
            <h3>Masques FFP2</h3>
            <div className='counters'>
              {productionFFP2.map(counter => (
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
          <div className='pie-chart'>
            <PieChartPercent
              data={productionFFP2.map(r => r.total)}
              labels={productionFFP2.map(r => r.label)}
              colors={productionFFP2.map(r => colors[r.color])}
              height={isMobileDevice ? 240 : 280}
            />
          </div>
          <div className='bar-chart'>
            <MasksProductionChart
              height={isMobileDevice ? 190 : 180}
              data={masksProductionGroup.filter(r => selectedWeek(date) >= r.week)}
              type='FFP2'
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          grid-gap: 1em;
          margin-top: 1em;
        }

        .col:nth-child(even) {
          background-color: ${colors.lighterGrey};
          border-radius: 4px;
        }

        h3, h3 {
          text-align: center;
        }

        .bar-chart {
          height: 250px;
        }

        .counters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          border-bottom: 1px solid ${colors.white};
        }

        .pie-chart {
          margin: 1em 0;
        }

        @media (max-width: ${theme.mobileDisplay}) {
          .grid {
            grid-template-columns: 1fr;
          }
      `}</style>
    </div>
  )
}

export default MaskStatistics
