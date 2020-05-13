import departements from '@etalab/decoupage-administratif/data/departements.json'
import regions from '@etalab/decoupage-administratif/data/regions.json'

export function getTerritoryFromLocation(location) {
  if (location && location !== 'FRA') {
    const [type, code] = location.split('-')
    const territories = type === 'REG' ? regions : departements

    const territory = territories.find(t => code === t.code)
    if (territory) {
      return {
        location,
        type,
        ...territory
      }
    }
  }

  return {location, name: 'France métropolitaine'}
}
