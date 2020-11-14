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
  const countryCode = 'us' // harding coding this until we build ui to handle
  const [countryDetailsMapping, setCountryDetailsMapping] = React.useState<Record<string, CountryDetails>>({})

  React.useEffect(() => {
    import(`../../../public/json/${countryCode}.json`).then((countryDetailModule) => {
      console.log('import')
      const countryDetailsList = convertCountryDetailModuleToList(countryDetailModule)
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
    })
  }, [])

  return (
    <h1 data-testid="helloH1" className="text-xl text-gray-900">
      Hello from {SITE_NAME}, viewing details for {countryCode}
      {MAPBOX_TOKEN && <Map countryDetailsMapping={countryDetailsMapping} token={MAPBOX_TOKEN}></Map>}
    </h1>
  )
}

export default Home
