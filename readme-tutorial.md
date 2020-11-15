# Building Visa Map

- get tailwind-react-next.js-typescript-eslint-jest-starter working

## Displaying a map

- Added a mapbox token to the environment variables
- Built a simple map component:

```ts
import React from 'react'
import ReactMapGL from 'react-map-gl'

const Map: React.FC<{ token: string }> = ({ token }) => {
  const [state, setState] = React.useState({
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8,
    },
  })

  return (
    <ReactMapGL
      mapboxApiAccessToken={token}
      {...state.viewport}
      onViewportChange={(viewport) => setState({ viewport })}
    />
  )
}

export default Map
```


## Resize the viewport on window resize

Resizing the window will cut off our map view, or leave whitespace around our map.

Usually, we might use useEffectLayout to accomplish this, and recalculate the `window` dimensions. However, in NextJS we can run into problems when trying to access `window` since it does not exist in server rendered.

(Read more here)[https://medium.com/frontend-digest/why-is-window-not-defined-in-nextjs-44daf7b4604e#:~:text=But%20why%20is%20window%20undefined,is%20not%20run%20in%20NodeJS.]

To avoid this, well attach a resize listener when the component loads that will fire a function to handle calculating our resize on the fly.

```ts
  React.useEffect(() => {
    setViewport({ ...viewport, width: innerWidth, height: innerHeight })
    window.addEventListener('resize', () => {
      setViewport({
        ...viewport,
        ...getWindowSize(),
      })
    })
  }, [])
```

## Add our geojson

I scraped info for every passport country holder and am holding it as local json in the project for now.

I have plans to improve this pipeline but for the moment so much of the information is coming through scraped websites and not apis.

I added a dynamic import for now, definitely needs a change later as this feels sketch.

```ts
map.addSource('countries-source', {
  type: 'geojson',
  data: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
})

map.addLayer({
  id: 'countries-covid-ban',
  source: 'countries-source',
  type: 'fill',
  paint: {
    'fill-color': '#b73849',
    'fill-outline-color': '#F2F2F2', //this helps us distinguish individual countries a bit better by giving them an outline
    'fill-opacity': 0.75,
  },
})

map.setFilter('countries-covid-ban', ['in', 'ISO_A2'].concat(['US'])) // This line lets us filter by country codes.

```

## Status Feedback

I was annoyed trying to verify if I was waiting on my source to load or if there was an error loading the source so I added some basic loading indicators

```js
enum MapStatus {
  Init,
  Loading,
  Loaded,
}
 ...

const [mapStatus, setMapStatus] = React.useState<MapStatus>(MapStatus.Init)

...
map.on('sourcedataloading', () => {
  setMapStatus(MapStatus.Loading)
})

map.on('sourcedata', () => {
  setMapStatus(MapStatus.Loaded)
})

<>
  <h2>{mapStatus}</h2>
  <ReactMapGL
    ref={mapRef}
    mapboxApiAccessToken={token}
    {...viewport}
    onViewportChange={(viewport) => setViewport(viewport)}
  />
</>

{GIF OF LOADING}
```

Since we re-render the map when countryDetailsList is updated I put the filter in a useEffect
```ts
  React.useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) {
      return
    }
    map.setFilter(
      'countries-covid-ban',
      ['in', 'ISO_A2'].concat(
        countryDetailsList.filter(({ details: { covidBan } }) => covidBan).map((countryDetail) => countryDetail.code),
      ),
    )
  }, [countryDetailsList])

  {IMAGE OF US BANNED COUNTRIES}
  ```

Now Im going to add a new layer and a new filter for coloring the other countries