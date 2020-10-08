import React, {useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Source, Layer} from 'react-map-gl'
import {ChevronLeft} from 'react-feather'

import colors from '../../../styles/colors'

import {SyntheseContext} from '.'
import {AppContext} from '../../../pages'

const COLORS = {
  vert: colors.green,
  orange: colors.orange,
  rouge: colors.red
}

const defaultColor = 'rgba(0,0,0,0)'

export const SyntheseMap = ({hovered, isDROM}) => {
  const {selectedLocation, setSelectedLocation, isMobileDevice} = useContext(AppContext)
  const {synthese} = useContext(SyntheseContext)
  const {code = '', region = ''} = hovered && hovered.feature ? hovered.feature.properties : {}

  const selectedRegion = selectedLocation.includes('REG') ? selectedLocation.split('-')[1] : null

  const handleBack = event => {
    event.stopPropagation()
    setSelectedLocation('FRA')
  }

  const getColors = useMemo(() => {
    const colors = ['match', ['get', 'code']]

    synthese.forEach(({code, indicateurSynthese}) => {
      colors.push(code, COLORS[indicateurSynthese])
    })

    colors.push(defaultColor)

    return colors.length > 3 ? colors : defaultColor
  }, [synthese])

  const getOpacity = useMemo(() => {
    return ['case', ['==', ['get', 'code'], region || code], 0, 0.5]
  }, [code, region])

  if (synthese) {
    const indicateurSynthese = {
      id: 'indicateur',
      'source-layer': 'departements',
      type: 'fill',
      paint: {
        'fill-color': getColors,
        'fill-outline-color': '#ffffff'
      }
    }

    const regionsLayer = {
      id: 'regions-fill',
      'source-layer': 'regions',
      type: 'fill',
      filter: selectedRegion ? ['!=', ['get', 'code'], selectedRegion] : ['has', 'code'],
      paint: {
        'fill-opacity': getOpacity,
        'fill-color': '#fff',
        'fill-outline-color': colors.darkBlue
      }
    }

    return (
      <>
        {!isDROM && selectedLocation !== 'FRA' && (
          <div className={`back ${isMobileDevice ? 'mobile' : ''}`} onClick={handleBack}>
            <ChevronLeft /> Retour
          </div>
        )}
        <Source
          id='decoupage-administratif'
          type='vector'
          attribution='Données Ministère des Solidarités et de la Santé'
          url='https://etalab-tiles.fr/data/decoupage-administratif.json'
        >
          <Layer beforeId='place-town' {...indicateurSynthese} />
          <Layer beforeId='place-town' {...regionsLayer} />
        </Source>

        <style jsx>{`
          .back {
            z-index: 2;
            position: absolute;
            display: flex;
            align-items: center;
            top: 0;
            left: calc(240px + 0.5em); // 240px is the width of <MapSelector />
            margin: 0.5em;
            padding: 0.5em;
            border-radius: 4px;
            color: #fff;
            background-color: #000000aa;
          }

          .back.mobile {
            left: 0;
          }

          .back:hover {
            cursor: pointer;
            background-color: #000;
          }
          `}</style>
      </>
    )
  }

  return null
}

SyntheseMap.defaultProps = {
  hovered: null,
  isDROM: false
}

SyntheseMap.propTypes = {
  hovered: PropTypes.object,
  isDROM: PropTypes.bool
}

export const onSelect = ({properties}) => {
  const {code, region} = properties
  return `${region ? 'DEP' : 'REG'}-${code}`
}

export const HoveredInfos = ({feature}) => {
  const {synthese} = useContext(SyntheseContext)
  const {code, region} = feature.properties

  if (region && synthese && synthese.length > 0) {
    const {indicateurSynthese} = synthese.find(s => s.code === code)

    return (
      <div>
        Département classé <b style={{color: COLORS[indicateurSynthese]}}>{indicateurSynthese}</b>
      </div>
    )
  }

  return null
}

HoveredInfos.propTypes = {
  feature: PropTypes.shape({
    properties: PropTypes.object.isRequired
  }).isRequired
}

export const interactiveLayersIds = ['regions-fill', 'indicateur']
