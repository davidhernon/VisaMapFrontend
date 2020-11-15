import React from 'react'
import Map from '@src/components/map'
import { CountryDetails } from 'types/map-types'

const convertCountryDetailModuleToList = (module: any) => {
  let countryDetailsList: CountryDetails[] = []
  for (let i = 0; i < 200; i++) {
    const countryDetail = module[i]
    if (typeof countryDetail === undefined) {
      return countryDetailsList
    }
    countryDetailsList.push(countryDetail)
  }
  return countryDetailsList
}

const Home: React.FC = () => {
  const { SITE_NAME } = process.env
  const { MAPBOX_TOKEN } = process.env // https://github.com/vercel/next.js/issues/6888
  const countryCode = 'US' // harding coding this until we build ui to handle
  const [countryDetailsMapping, setCountryDetailsMapping] = React.useState<Record<string, CountryDetails>>({})
  const [countryDetailsList, setCountryDetailsList] = React.useState<CountryDetails[]>([])
  React.useEffect(() => {
    import(`../../../public/json/${countryCode}.json`).then((countryDetailModule) => {
      console.log('import')
      const countryDetailsList = convertCountryDetailModuleToList(countryDetailModule).filter((cd) => cd !== undefined)
      const countryMapping = countryDetailsList.reduce((accum, countryDetail) => {
        if (!!!countryDetail) {
          return accum
        }
        return {
          ...accum,
          [countryDetail.code]: countryDetail,
        }
      }, {} as Record<string, CountryDetails>)
      setCountryDetailsMapping(countryMapping)
      setCountryDetailsList(countryDetailsList)
    })
  }, [])
  return (
    <>
      <h1 data-testid="helloH1" className="text-xl text-gray-900">
        Hello from {SITE_NAME}, viewing details for "{countryCode}"
      </h1>
      {MAPBOX_TOKEN && <Map countryDetailsList={countryDetailsList} token={MAPBOX_TOKEN}></Map>}
    </>
  )
}

export default Home
