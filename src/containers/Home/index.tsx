import React from 'react'
import Map from '@src/components/map'
import { CountryDetails } from 'types/map-types'
import { convertCountryDetailModuleToList } from '@src/utils/json-data-utils'
import { useRouter } from 'next/dist/client/router'
import { countryCodeMap, getCountryNameFromCode } from '@src/utils/country-mapping'

const Home: React.FC<{ iso?: string }> = ({ iso = 'US' }) => {
  const { SITE_NAME } = process.env
  const { MAPBOX_TOKEN } = process.env // https://github.com/vercel/next.js/issues/6888
  const router = useRouter()
  const path = router.pathname

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
        Visa restrictions for {getCountryNameFromCode(iso)}
      </h1>
      <select name="iso" onChange={(e) => router.replace(`${path}?iso=${e.target.value}`)}>
        {countryCodeMap.map(({ code, name }) => (
          <option key={code} value={code} selected={iso === code.toUpperCase()}>
            {name}
          </option>
        ))}
      </select>
      {MAPBOX_TOKEN && <Map countryDetailsList={countryDetailsList} token={MAPBOX_TOKEN}></Map>}
    </>
  )
}

export default Home
