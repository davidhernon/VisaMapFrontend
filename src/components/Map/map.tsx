import React from 'react';
import ReactMapGL, { PointerEvent, Popup } from 'react-map-gl';
import { CountryDetails } from 'types/map-types';
import { getWindowSize } from '@src/components/helpers/map-helpers';
import mapboxgl from 'mapbox-gl';
import { colors } from '@src/utils/theme';
import { getCountryNameFromCode } from '@src/utils/country-mapping';
import LegendItem from '@src/components/Legend/LegendItem';
import LoadingSvg from '@src/components/LoadingIcon';
import debounce from 'lodash.debounce';
import { countryDataSource, MapStatus } from '@src/components/Map/map-helpers';

const setHoveredCountry = debounce(
  ({
    e,
    hoveredFeatureId,
    popupVisible,
    setHoveredFeatureId,
    setBackgroundHoveredFeatureId,
  }: {
    e: PointerEvent;
    hoveredFeatureId: null | string | number;
    popupVisible: boolean;
    setHoveredFeatureId: (iso: string | null) => void;
    setBackgroundHoveredFeatureId: (iso: string | null) => void;
  }) => {
    if (!e.features) {
      return;
    }
    const countryFeature = e.features.find(
      (feature) => feature.layer.id === 'country-status',
    );

    if (
      (!hoveredFeatureId && countryFeature) ||
      (countryFeature && countryFeature.properties.ISO_A2 !== hoveredFeatureId)
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
  },
  100,
  {
    maxWait: 100,
  },
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
  iso: string;
  token: string;
  countryDetailsList: CountryDetails[];
}> = ({ countryDetailsList, iso, token }) => {
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
  const [hoveredCountryDetail, setHoveredCountryDetail] = React.useState(
    countryDetailsList.find(
      (countryDetail) => countryDetail.code === iso,
    ) as CountryDetails,
  );
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

    map.addLayer(
      {
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
      },
      'country-label-sm',
    );
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

  /**
   * When the popup dissapears we get stuck in a state where a new hover event is not fired so the UI does not update.
   * This effect runs when the popup changes visibility, when it dissapears we set the hoverId to be the same as the hover id we were tracking in the background
   * We always track a background hover id, even when the popup is open (we dont update hoveredFeatureId when the popup is open)
   * This improves our UX for this edge case
   */
  React.useEffect(() => {
    if (!popupVisible) {
      setHoveredFeatureId(backgroundHoveredFeatureId);
    }
  }, [popupVisible]);

  /**
   * When the hoveredId changes well look up the country information
   * If the user opens a popup we will use this to show detailed information about the country they selected.
   */
  React.useEffect(() => {
    const countryDetails = countryDetailsList.find(
      (countryDetail) => countryDetail.code === hoveredFeatureId,
    ) as CountryDetails;
    setHoveredCountryDetail(countryDetails);
  }, [hoveredFeatureId]);

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
          setHoveredCountry({
            e,
            hoveredFeatureId,
            popupVisible,
            setHoveredFeatureId,
            setBackgroundHoveredFeatureId,
          });
        }}
      >
        {popupVisible && (
          <Popup
            latitude={popupDetails.lngLat[1]}
            longitude={popupDetails.lngLat[0]}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setPopupVisible(false)}
            anchor="top"
          >
            <div>
              <h3 className="font-bold">
                {getCountryNameFromCode(hoveredCountryDetail.code)}
              </h3>
              <div className="max-w-1/2">
                {hoveredCountryDetail.details.covidBan && (
                  <LegendItem
                    color={colors['covid-ban']}
                    description={`Covid-19 travel restrictions for ${getCountryNameFromCode(
                      iso,
                    )}`}
                  />
                )}
                {hoveredCountryDetail.details.eVisa && (
                  <LegendItem
                    color={colors['e-visa']}
                    description={`E-Visa available`}
                  />
                )}
                {hoveredCountryDetail.details.visaOnArrival && (
                  <LegendItem
                    color={colors['on-arrival']}
                    description={`Visa available on arrival`}
                  />
                )}
                {hoveredCountryDetail.details.visaRequired && (
                  <LegendItem
                    color={colors.required}
                    description={`Visa Required`}
                  />
                )}
                {!hoveredCountryDetail.details.visaRequired &&
                  !hoveredCountryDetail.details.covidBan && (
                    <LegendItem
                      color={colors['visa-free']}
                      description={`Travel is possible`}
                    />
                  )}
              </div>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
};

export default Map;
