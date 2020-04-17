import React, {useState, useContext, useCallback, useMemo} from 'react'
import DeckGL, {ArcLayer} from 'deck.gl'
import ReactMapGL, {Popup} from 'react-map-gl'

import geo from '../../geo.json'
import regions from '../../regions.json'

import {TransfertContext} from '../layouts/transfert'

import TransfertPopup from './transfert-popup'
import {AppContext} from '../../pages'

const EUROPE_CENTER = [11.9531, 50.2331]

const getRegionCenter = name => {
  const {code} = regions.find(({region}) => region === name)
  return geo[code].center
}

const TransfertMap = () => {
  const {isMobileDevice} = useContext(AppContext)
  const {transfertsGroup, setSelectedTransferts} = useContext(TransfertContext)

  const [hovered, setHovered] = useState(null)

  const defaultViewport = {
    latitude: 46.9,
    longitude: 1.7,
    zoom: isMobileDevice ? 3.8 : 5
  }

  const onHover = useCallback(info => {
    if (info && info.lngLat) {
      const [longitude, latitude] = info.lngLat
      setHovered({
        longitude,
        latitude,
        data: info.object
      })
    }
  }, [])

  const onClick = useCallback(info => {
    if (info.object) {
      setSelectedTransferts(info.object.transferts)
    }
  }, [setSelectedTransferts])

  const onMapClick = useCallback(() => {
    if (!hovered.data) {
      setSelectedTransferts(null)
    }
  }, [hovered, setSelectedTransferts])

  const getData = useMemo(() => {
    return transfertsGroup.map(transfert => {
      return {
        ...transfert,
        from: {
          coordinates: getRegionCenter(transfert.regionDepart)
        },
        to: {
          coordinates: transfert.regionArrivee ? getRegionCenter(transfert.regionArrivee) : EUROPE_CENTER
        }
      }
    })
  }, [transfertsGroup])

  const getLayers = useMemo(() => {
    return [
      new ArcLayer({
        id: 'arcs',
        data: getData,
        autoHighlight: true,
        pickable: true,
        getHeight: () => 2,
        getWidth: d => Math.sqrt(d.nbPatientsTransferes),
        getSourcePosition: d => d.from.coordinates,
        getTargetPosition: d => d.to.coordinates,
        widthScale: 1.5,
        getSourceColor: [209, 51, 91],
        getTargetColor: [0, 65, 146],
        onHover: isMobileDevice ? null : onHover,
        onClick
      })
    ]
  }, [getData, isMobileDevice, onHover, onClick])

  return (
    <ReactMapGL
      viewState={defaultViewport}
      width='100%'
      height='100%'
      mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
      onClick={onMapClick}
    >
      <DeckGL initialViewState={defaultViewport} layers={getLayers} />
      {hovered && hovered.data && (
        <Popup
          longitude={hovered.longitude}
          latitude={hovered.latitude}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setHovered(null)}
          anchor='bottom-left'
        >
          <TransfertPopup {...hovered.data} />
        </Popup>)}
    </ReactMapGL>
  )
}

export default TransfertMap
