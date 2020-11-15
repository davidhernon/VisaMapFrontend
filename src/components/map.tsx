import React from 'react'
import ReactMapGL from 'react-map-gl'
import { CountryDetails } from 'types/map-types'
import { getWindowSize } from '@src/components/helpers/map-helpers'

enum MapStatus {
  Init = 'Init',
  Loading = 'Loading',
  Loaded = 'Loaded',
}

const CountryTypes = {
  CovidBan: 'countries-covid-ban',
  VisaFree: 'countries-visa-free',
  VisaOnArrival: 'countries-visa-on-arrival',
  VisaRequired: 'countries-visa-required',
  EVisa: 'countries-e-visa',
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

    const covidBannedCountries = countryDetailsList
      .filter(({ details: { covidBan } }) => covidBan)
      .map((countryDetail) => countryDetail.code)

    const visaFreeCountries = countryDetailsList
      .filter(({ details }) => !details.visaRequired)
      .map((countryDetail) => countryDetail.code)
      .filter((code) => !covidBannedCountries.includes(code))

    const visaOnArrivalCountries = countryDetailsList
      .filter(({ details: { visaOnArrival } }) => visaOnArrival)
      .map((countryDetail) => countryDetail.code)

    const visaRequired = countryDetailsList
      .filter(({ details: { visaRequired } }) => visaRequired)
      .map(({ code }) => code)
      .filter((code) => !visaOnArrivalCountries.includes(code))

    const eVisa = countryDetailsList
      .filter(({ details: { eVisa } }) => eVisa)
      .map(({ code }) => code)
      .filter((code) => !visaOnArrivalCountries.includes(code) || !visaFreeCountries.includes(code))

    const allCodes: string[] = countryDetailsList.map(({ code }) => code)

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
      map.addSource('countries-source', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
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
      {mapStatus !== MapStatus.Loaded && <span className="absolute z-10">{mapStatus}</span>}
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
