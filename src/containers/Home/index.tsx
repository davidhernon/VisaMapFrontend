import React from 'react'
import Map from '@src/components/map'
import { CountryDetails } from 'types/map-types'
import { convertCountryDetailModuleToList } from '@src/utils/json-data-utils'

const Home: React.FC<{ iso?: string }> = ({ iso = 'US' }) => {
  const { SITE_NAME } = process.env
  const { MAPBOX_TOKEN } = process.env // https://github.com/vercel/next.js/issues/6888

  const [countryDetailsList, setCountryDetailsList] = React.useState<CountryDetails[]>([])
  React.useEffect(() => {
    import(`../../../public/json/${iso}.json`).then((countryDetailModule) => {
      const countryDetailsList = convertCountryDetailModuleToList(countryDetailModule).filter((cd) => cd !== undefined)
      setCountryDetailsList(countryDetailsList)
    })
  }, [iso])
  return (
    <>
      <h1 data-testid="helloH1" className="text-xl text-gray-900">
        {SITE_NAME}, visa status for "{iso}"
      </h1>
      {MAPBOX_TOKEN && <Map countryDetailsList={countryDetailsList} token={MAPBOX_TOKEN}></Map>}
    </>
  )
}

export default Home
