import React, {useState} from 'react'
import DeckGL, {ArcLayer} from 'deck.gl'
import ReactMapGL, {Popup} from 'react-map-gl'

import geo from '../../geo.json'
import transferts from '../../transferts.json'
import regions from '../../regions.json'

import TransfertPopup from './transfert-popup'

const TransfertMap = () => {
  const [hovered, setHovered] = useState(null)

  const defaultViewport = {
    latitude: 46.9,
    longitude: 1.7,
    zoom: 5
  }

  const onHover = (info, event) => {
    if (info.object) {
      const [longitude, latitude] = info.lngLat
      const hoverInfo = {
        longitude,
        latitude,
        start: info.object.start,
        end: info.object.end,
        way: info.object.way,
        from: info.object.from,
        to: info.object.to,
        patients: parseInt(info.object.patients, 10)
      }

      setHovered(hoverInfo)
    } else {
      setHovered(null)
    }
  }

  const data = []
  const regionDepart = []
  const regionArrivee = []

  transferts.map(item => {
    return regionDepart.push(regions.filter(region => {
      return region.region === item.region_depart
    }))
  })

  transferts.map(item => {
    return regionArrivee.push(regions.filter(region => {
      return region.region === item.region_arrivee
    }))
  })

  transferts.map((item, index) => {
    const dataToPush = {
      start: item.debut_transfert,
      end: item.fin_transfert,
      way: item.type_vecteur,
      patients: item.nombre_patients_transferes,
      from: {
        name: item.region_depart,
        coordinates: [geo[regionDepart[index][0].code].center[0], geo[regionDepart[index][0].code].center[1]]
      },
      to: {
        name: regionArrivee[index][0] ? item.region_arrivee : 'Pays européens',
        coordinates: [regionArrivee[index][0] ? geo[regionArrivee[index][0].code].center[0] : 11.9531, regionArrivee[index][0] ? geo[regionArrivee[index][0].code].center[1] : 50.2331]
      }
    }

    return data.push(dataToPush)
  })

  const layers = [
    new ArcLayer({
      id: 'arcs',
      data,
      autoHighlight: true,
      pickable: true,
      getWidth: d => Math.sqrt(d.patients),
      getSourcePosition: d => d.from.coordinates,
      getTargetPosition: d => d.to.coordinates,
      getSourceColor: [209, 51, 91],
      getTargetColor: [0, 65, 146],
      onHover: (info, event) => onHover(info, event)
    })
  ]

  return (
    <ReactMapGL
      viewState={defaultViewport}
      width='100%'
      height='100%'
      mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
    >
      <DeckGL initialViewState={defaultViewport} layers={layers} />
      {hovered && (
        <Popup
          longitude={hovered.longitude}
          latitude={hovered.latitude}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setHovered(null)}
          anchor='bottom-left'
        >
          <TransfertPopup data={hovered} />
        </Popup>)}
    </ReactMapGL>
  )
}

export default TransfertMap
