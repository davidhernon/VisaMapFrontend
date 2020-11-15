import React from 'react'
import { useRouter } from 'next/dist/client/router'
import { CountryDetails } from 'types/map-types'
import { convertCountryDetailModuleToList } from '@src/utils/json-data-utils'
import Map from '@src/components/map'

const Visa = () => {
  const { SITE_NAME } = process.env
  const { MAPBOX_TOKEN } = process.env
  const router = useRouter()
  const { iso } = router.query
  console.log({ iso })
  const countryCode = iso?.toString().toUpperCase() //handle exceptions and set default to US, pretty hack, needs a refactor
  const [countryDetailsList, setCountryDetailsList] = React.useState<CountryDetails[]>([])
  React.useEffect(() => {
    if (!countryCode) {
      return
    }
    import(`@src/../public/json/${countryCode}.json`)
      .then((countryDetailModule) => {
        console.log({ import: countryDetailModule })
        const countryDetailsList = convertCountryDetailModuleToList(countryDetailModule).filter(
          (cd) => cd !== undefined,
        )
        setCountryDetailsList(countryDetailsList)
      })
      .catch((e) => {
        throw new Error(e)
      })
  }, [countryCode])

  return (
    <>
      <h1 data-testid="helloH1" className="text-xl text-gray-900">
        Hello from {SITE_NAME}, viewing details for "{countryCode}"
      </h1>
      {MAPBOX_TOKEN && <Map countryDetailsList={countryDetailsList} token={MAPBOX_TOKEN}></Map>}
    </>
  )
}

export default Visa
