import React from 'react'
import Map from '@src/components/map'

const Home: React.FC = () => {
  const { SITE_NAME } = process.env
  const { MAPBOX_TOKEN } = process.env // https://github.com/vercel/next.js/issues/6888

  return (
    <h1 data-testid="helloH1" className="text-xl text-gray-900">
      Hello from {SITE_NAME}
      {MAPBOX_TOKEN && <Map token={MAPBOX_TOKEN}></Map>}
    </h1>
  )
}

export default Home
