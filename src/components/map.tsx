import React from 'react'
import ReactMapGL from 'react-map-gl'
import { CountryDetails } from 'types/map-types'

const getWindowSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

const getMap = (mapRef?: React.MutableRefObject<null | ReactMapGL>) => {
  return mapRef && mapRef.current?.getMap()
}

const Map: React.FC<{ token: string; countryDetailsMapping: Record<string, CountryDetails> }> = ({
  countryDetailsMapping,
  token,
}) => {
  const mapRef = React.useRef<null | ReactMapGL>(null)
  const [viewport, setViewport] = React.useState({
    width: 0,
    height: 0,
    latitude: 0,
    longitude: 0,
    zoom: 1,
  })

  React.useEffect(() => {
    const map = mapRef.current?.getMap()
    map &&
      map.on('load', () => {
        map.addLayer({
          //here we are adding a layer containing the tileset we just uploaded
          id: 'countries-allowed', //this is the name of our layer, which we will need later
          source: {
            type: 'vector',
            url: 'mapbox://byfrost-articles.74qv0xp0', // <--- Add the Map ID you copied here
          },
          'source-layer': 'ne_10m_admin_0_countries-76t9ly', // <--- Add the source layer name you copied here
          type: 'fill',
          paint: {
            'fill-color': '#52489C', //this is the color you want your tileset to have (I used a nice purple color)
            'fill-outline-color': '#F2F2F2', //this helps us distinguish individual countries a bit better by giving them an outline
            'fill-opacity': 0.75,
          },
        })

        map.addLayer({
          //here we are adding a layer containing the tileset we just uploaded
          id: 'countries-covid-ban', //this is the name of our layer, which we will need later
          source: {
            type: 'vector',
            url: 'mapbox://byfrost-articles.74qv0xp0', // <--- Add the Map ID you copied here
          },
          'source-layer': 'ne_10m_admin_0_countries-76t9ly', // <--- Add the source layer name you copied here
          type: 'fill',
          paint: {
            'fill-color': '#f7c12f', //this is the color you want your tileset to have (I used a nice purple color)
            'fill-outline-color': '#F2F2F2', //this helps us distinguish individual countries a bit better by giving them an outline
          },
        })

        map.setFilter('countries-allowed', ['in', 'ADM0_A3_IS'].concat(['USA'])) // This line lets us filter by country codes.
        map.setFilter('countries-covid-ban', ['in', 'ADM0_A3_IS'].concat(['AUS', 'NGA'])) // This line lets us filter by country codes.
      })
  }, [mapRef])

  React.useEffect(() => {
    setViewport({ ...viewport, ...getWindowSize() })
    window.addEventListener('resize', () => {
      setViewport({
        ...viewport,
        ...getWindowSize(),
      })
    })
  }, [])

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxApiAccessToken={token}
      {...viewport}
      onViewportChange={(viewport) => setViewport(viewport)}
    />
  )
}

export default Map
