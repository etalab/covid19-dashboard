import {find} from 'lodash'
import computeCenter from '@turf/center'

import contoursRegions from '../public/regions-100m.json'

function getRegion(codeRegion) {
  const {features} = contoursRegions
  return find(features, ({properties}) => properties.code === codeRegion)
}

export function getRegionCenter(codeRegion) {
  const region = getRegion(codeRegion)
  if (region) {
    return computeCenter(region.geometry)
  }

  throw new Error(`codeRegion ${codeRegion} invalide`)
}
