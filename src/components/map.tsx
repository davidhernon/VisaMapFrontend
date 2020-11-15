import React from 'react'
import ReactMapGL from 'react-map-gl'
import { CountryDetails } from 'types/map-types'
import {
  getCovidBannedCountries,
  getEVisaCountries,
  getVisaFreeCountries,
  getVisaOnArrivalCountries,
  getVisaRequiredCountries,
  getWindowSize,
} from '@src/components/helpers/map-helpers'

enum CountrySource {
  Id = 'country-source',
  Url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
  DataType = 'geojson',
}

enum MapStatus {
  Init = 'Init',
  Loading = 'Loading',
  Loaded = 'Loaded',
}

enum CountryTypes {
  CovidBan = 'countries-covid-ban',
  VisaFree = 'countries-visa-free',
  VisaOnArrival = 'countries-visa-on-arrival',
  VisaRequired = 'countries-visa-required',
  EVisa = 'countries-e-visa',
}

const Map: React.FC<{
  token: string
  countryDetailsList: CountryDetails[]
}> = ({ countryDetailsList, token }) => {
  const mapRef = React.useRef<null | ReactMapGL>(null)
  const [mapStatus, setMapStatus] = React.useState<MapStatus>(MapStatus.Init)
  const [viewport, setViewport] = React.useState({
    width: 0,
    height: 0,
    latitude: 0,
    longitude: 0,
    zoom: 1,
  })

  React.useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map || mapStatus === MapStatus.Loading || mapStatus === MapStatus.Init) {
      return
    }
    const covidBannedCountries = getCovidBannedCountries(countryDetailsList)
    const visaFreeCountries = getVisaFreeCountries(countryDetailsList).filter(
      (code) => !covidBannedCountries.includes(code),
    )
    const visaOnArrivalCountries = getVisaOnArrivalCountries(countryDetailsList)
    const visaRequired = getVisaRequiredCountries(countryDetailsList).filter(
      (code) => !visaOnArrivalCountries.includes(code),
    )
    const eVisa = getEVisaCountries(countryDetailsList).filter(
      (code) => !visaOnArrivalCountries.includes(code) || !visaFreeCountries.includes(code),
    )
    map.setFilter(CountryTypes.CovidBan, ['in', 'ISO_A2'].concat(covidBannedCountries))
    map.setFilter(CountryTypes.VisaFree, ['in', 'ISO_A2'].concat(visaFreeCountries))
    map.setFilter(CountryTypes.VisaOnArrival, ['in', 'ISO_A2'].concat(visaOnArrivalCountries))
    map.setFilter(CountryTypes.VisaRequired, ['in', 'ISO_A2'].concat(visaRequired))
    map.setFilter(CountryTypes.EVisa, ['in', 'ISO_A2'].concat(eVisa))
  }, [countryDetailsList, mapStatus])

  React.useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) {
      return
    }

    map.on('sourcedataloading', () => {
      setMapStatus(MapStatus.Loading)
    })

    map.on('sourcedata', () => {
      setMapStatus(MapStatus.Loaded)
    })

    map.on('load', () => {
      map.addSource(CountrySource.Id, {
        type: CountrySource.DataType,
        data: CountrySource.Url,
      })

      map.addLayer({
        id: CountryTypes.CovidBan,
        source: 'countries-source',
        type: 'fill',
        paint: {
          'fill-color': '#b73849',
          'fill-outline-color': '#F2F2F2', //this helps us distinguish individual countries a bit better by giving them an outline
          'fill-opacity': 0.75,
        },
      })

      map.addLayer({
        id: CountryTypes.VisaFree,
        source: 'countries-source',
        type: 'fill',
        paint: {
          'fill-color': '#2bd47d',
          'fill-outline-color': '#F2F2F2', //this helps us distinguish individual countries a bit better by giving them an outline
          'fill-opacity': 0.75,
        },
      })

      map.addLayer({
        id: CountryTypes.VisaOnArrival,
        source: 'countries-source',
        type: 'fill',
        paint: {
          'fill-color': '#607d8b',
          'fill-outline-color': '#F2F2F2', //this helps us distinguish individual countries a bit better by giving them an outline
          'fill-opacity': 0.75,
        },
      })

      map.addLayer({
        id: CountryTypes.VisaRequired,
        source: 'countries-source',
        type: 'fill',
        paint: {
          'fill-color': '#ffab00',
          'fill-outline-color': '#F2F2F2', //this helps us distinguish individual countries a bit better by giving them an outline
          'fill-opacity': 0.75,
        },
      })

      map.addLayer({
        id: CountryTypes.EVisa,
        source: 'countries-source',
        type: 'fill',
        paint: {
          'fill-color': '#64b5f6',
          'fill-outline-color': '#F2F2F2', //this helps us distinguish individual countries a bit better by giving them an outline
          'fill-opacity': 0.75,
        },
      })
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
    <>
      <h2>{mapStatus}</h2>
      <ReactMapGL
        ref={mapRef}
        mapboxApiAccessToken={token}
        {...viewport}
        onViewportChange={(viewport) => setViewport(viewport)}
      />
    </>
  )
}

export default Map
