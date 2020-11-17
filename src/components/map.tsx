import React from 'react';
import ReactMapGL, { PointerEvent, Popup } from 'react-map-gl';
import { CountryDetails } from 'types/map-types';
import { getWindowSize } from '@src/components/helpers/map-helpers';
import mapboxgl from 'mapbox-gl';
import { colors } from '@src/utils/theme';

enum MapStatus {
  Init = 'Init',
  Loading = 'Loading',
  Loaded = 'Loaded',
}

const countryDataSource: {
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

const LoadingSvg = () => (
  <svg
    width="54px"
    height="54px"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle
      cx="50"
      cy="50"
      r="32"
      strokeWidth="8"
      stroke="#64b5f6"
      strokeDasharray="50.26548245743669 50.26548245743669"
      fill="none"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        dur="1.6949152542372878s"
        repeatCount="indefinite"
        keyTimes="0;1"
        values="0 50 50;360 50 50"
      ></animateTransform>
    </circle>
    <circle
      cx="50"
      cy="50"
      r="23"
      strokeWidth="8"
      stroke="#2bd47d"
      strokeDasharray="36.12831551628262 36.12831551628262"
      strokeDashoffset="36.12831551628262"
      fill="none"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        dur="1.6949152542372878s"
        repeatCount="indefinite"
        keyTimes="0;1"
        values="0 50 50;-360 50 50"
      ></animateTransform>
    </circle>
  </svg>
);

/**
 * Mapbox Expression Helper
 * Returns expression that evaluates to true or false if the selected field is in a given array
 */
const includesField = (field: string) => (array: (string | number)[]) => [
  'in',
  ['get', field],
  ['literal', array],
];

const includesIso = includesField('ISO_A2');

const Map: React.FC<{
  token: string;
  countryDetailsList: CountryDetails[];
}> = ({ countryDetailsList, token }) => {
  const mapRef = React.useRef<null | ReactMapGL>(null);
  const [popupVisible, setPopupVisible] = React.useState<boolean>(false);
  const [popupDetails, setPopupDetails] = React.useState<{
    lngLat: [number, number];
  }>({ lngLat: [0, 0] });
  const [hoveredFeatureId, setHoveredFeatureId] = React.useState<
    null | number | string
  >(null);
  const [
    backgroundHoveredFeatureId,
    setBackgroundHoveredFeatureId,
  ] = React.useState<null | number | string>(null);
  const [mapStatus, setMapStatus] = React.useState<MapStatus>(MapStatus.Init);
  const [viewport, setViewport] = React.useState({
    width: 0,
    height: 0,
    latitude: 0,
    longitude: 0,
    zoom: 1,
  });

  const covidBannedCountries = countryDetailsList
    .filter(({ details: { covidBan } }) => covidBan)
    .map((countryDetail) => countryDetail.code);

  const visaFreeCountries = countryDetailsList
    .filter(({ details }) => !details.visaRequired)
    .map((countryDetail) => countryDetail.code)
    .filter((code) => !covidBannedCountries.includes(code));

  const eVisa = countryDetailsList
    .filter(({ details: { eVisa } }) => eVisa)
    .map(({ code }) => code);

  const visaOnArrivalCountries = countryDetailsList
    .filter(({ details: { visaOnArrival } }) => visaOnArrival)
    .map((countryDetail) => countryDetail.code);

  const visaRequired = countryDetailsList
    .filter(({ details: { visaRequired } }) => visaRequired)
    .map(({ code }) => code)
    .filter((code) => !visaOnArrivalCountries.includes(code));

  React.useEffect(() => {
    const map = mapRef.current?.getMap();
    if (
      !map ||
      mapStatus === MapStatus.Loading ||
      mapStatus === MapStatus.Init ||
      !map.getSource(countryDataSource.id)
    ) {
      return;
    }

    const layer = map.getLayer('country-status');
    if (layer) {
      map.removeLayer('country-status');
    }

    map.addLayer({
      id: 'country-status',
      source: countryDataSource.id,
      type: 'fill',
      paint: {
        'fill-color': [
          'case',
          includesIso(covidBannedCountries),
          colors['covid-ban'],
          includesIso(eVisa),
          colors['e-visa'],
          includesIso(visaOnArrivalCountries),
          colors['on-arrival'],
          includesIso(visaFreeCountries),
          colors['visa-free'],
          includesIso(visaRequired),
          colors.required,
          colors['no-data'],
        ],
        'fill-outline-color': '#F2F2F2',
        'fill-opacity': [
          'case',
          ['==', ['get', 'ISO_A2'], hoveredFeatureId],
          1,
          0.75,
        ],
      },
    });
  }, [
    covidBannedCountries,
    visaRequired,
    eVisa,
    visaOnArrivalCountries,
    visaFreeCountries,
    mapStatus,
    hoveredFeatureId,
  ]);

  React.useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    map.on('sourcedataloading', () => {
      if (MapStatus.Loaded) {
        // if we already loaded the map once don't hide the UI again
        return;
      }
      setMapStatus(MapStatus.Loading);
    });

    map.on('sourcedata', () => {
      if (
        map.getSource(countryDataSource.id) &&
        map.isSourceLoaded(countryDataSource.id)
      ) {
        setMapStatus(MapStatus.Loaded);
      }
    });
    let hoveredStateId: undefined | number | string = undefined;
    map.on('load', () => {
      map.addSource(countryDataSource.id, countryDataSource.source);
    });
  }, [mapRef]);

  React.useEffect(() => {
    console.log({ popupVisible, backgroundHoveredFeatureId });
    if (!popupVisible) {
      setHoveredFeatureId(backgroundHoveredFeatureId);
    }
  }, [popupVisible]);

  React.useEffect(() => {
    setViewport({ ...viewport, ...getWindowSize() });
    window.addEventListener('resize', () => {
      setViewport({
        ...viewport,
        ...getWindowSize(),
      });
    });
  }, []);

  return (
    <div style={{ cursor: 'pointer !important' }}>
      {mapStatus !== MapStatus.Loaded && (
        <span className="flex justify-center items-center absolute z-10 w-full h-full bg-gray-200">
          <LoadingSvg />
        </span>
      )}
      <ReactMapGL
        ref={mapRef}
        getCursor={(e) => {
          if (hoveredFeatureId && !popupVisible) {
            return 'pointer';
          }
          return 'grab';
        }}
        mapboxApiAccessToken={token}
        {...viewport}
        onViewportChange={(viewport) => setViewport(viewport)}
        doubleClickZoom={false}
        onClick={(e: PointerEvent) => {
          if (!popupVisible) {
            const countryFeature =
              e.features &&
              e.features.find(
                (feature) => feature.layer.id === 'country-status',
              );
            if (countryFeature) {
              setHoveredFeatureId(countryFeature.properties.ISO_A2);
              setBackgroundHoveredFeatureId(countryFeature.properties.ISO_A2);
              setPopupDetails({ lngLat: e.lngLat });
              setPopupVisible(true);
            }
            return;
          }
          setPopupVisible(false);
          return;
        }}
        onHover={(e) => {
          const countryFeature =
            e.features &&
            e.features.find((feature) => feature.layer.id === 'country-status');
          if (
            (!hoveredFeatureId && countryFeature) ||
            (countryFeature &&
              countryFeature.properties.ISO_A2 !== hoveredFeatureId)
          ) {
            if (!popupVisible) {
              setHoveredFeatureId(countryFeature.properties.ISO_A2);
            }
            setBackgroundHoveredFeatureId(countryFeature.properties.ISO_A2);
            return;
          }
          if (hoveredFeatureId && !countryFeature) {
            if (!popupVisible) {
              setHoveredFeatureId(null);
            }
            setBackgroundHoveredFeatureId(null);
          }
        }}
      >
        {popupVisible && (
          <Popup
            latitude={popupDetails.lngLat[1]}
            longitude={popupDetails.lngLat[0]}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setPopupVisible(false)}
            anchor="top"
          >
            Popup
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
};

export default Map;
