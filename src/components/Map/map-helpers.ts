export enum MapStatus {
    Init = 'Init',
    Loading = 'Loading',
    Loaded = 'Loaded',
  }
  
export const countryDataSource: {
    id: string;
    source: mapboxgl.AnySourceData;
  } = {
    id: 'countries-source',
    source: {
      type: 'geojson',
      data:
        'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
    },
  };