import { readSync } from 'fs'
import React from 'react'
import ReactMapGL from 'react-map-gl'

const getWindowSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

const Map: React.FC<{ token: string }> = ({ token }) => {
  const [viewport, setViewport] = React.useState({
    width: 0,
    height: 0,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  })

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
    <ReactMapGL mapboxApiAccessToken={token} {...viewport} onViewportChange={(viewport) => setViewport(viewport)} />
  )
}

export default Map
