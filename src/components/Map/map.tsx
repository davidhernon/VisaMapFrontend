import React from 'react';
import ReactMapGL, { PointerEvent } from 'react-map-gl';
import { CountryDetails } from 'types/map-types';
import { getWindowSize } from '@src/components/helpers/map-helpers';
import LoadingSvg from '@src/components/LoadingIcon';
import {
  countryDataSource,
  MapStatus,
  setHoveredCountry,
  getCountryStatusSets,
  getCountryFeatureFromPointerEvent,
  getCountryStatusLayer,
  getFirstSymbolIdFromMapLayers,
} from '@src/components/Map/map-helpers';
import CountryPopup from '@src/components/Map/CountryPopup';
import { CountryTravelRestriction } from 'types/travel-restrictions-types';

const Map: React.FC<{
  iso: string;
  token: string;
  restrictions: CountryTravelRestriction;
  countryDetailsList: CountryDetails[];
}> = ({ countryDetailsList, iso, restrictions, token }) => {
  const mapRef = React.useRef<null | ReactMapGL>(null);
  const [map, setMap] = React.useState<null | mapboxgl.Map>(null);
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
  // Keep track of what the first painted layer is so we can draw the choropleth underneath labels etc
  const [firstLayer, setFirstLayer] = React.useState<string>(
    'country-label-sm',
  );

  const [
    {
      covidBannedCountries,
      visaFreeCountries,
      eVisa,
      visaOnArrivalCountries,
      visaRequired,
    },
    setCountryStatusSets,
  ] = React.useState<{
    covidBannedCountries: string[];
    visaFreeCountries: string[];
    eVisa: string[];
    visaOnArrivalCountries: string[];
    visaRequired: string[];
  }>({
    covidBannedCountries: [],
    visaFreeCountries: [],
    eVisa: [],
    visaOnArrivalCountries: [],
    visaRequired: [],
  });

  // When country details list changes well call the helper to create sets of country iso codes that pertain to each case
  // This will be used when we fill the layer, this effect will only run once when the user selects the country iso code
  React.useEffect(() => {
    setCountryStatusSets(getCountryStatusSets(countryDetailsList));
  }, [countryDetailsList]);

  React.useEffect(() => {
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
    console.log(restrictions);

    // @todo - make hover UI a separate layer so we don't have to calc this every time it changes
    map.addLayer(
      getCountryStatusLayer({
        hoveredFeatureId,
        covidBannedCountries,
        lowTravelRestrictions: restrictions.source.features.reduce<string[]>(
          (accum, feature) => {
            if (
              (feature.properties.restrictions?.master_travel_status ||
                'UNKNOWN') === 'LOW'
            ) {
              if (feature.properties.country_code === 'GB') {
                return [...accum, 'UK'];
              }
              return [...accum, feature.properties.country_code];
            }
            return accum;
          },
          [],
        ),
        majorTravelRestrictions: restrictions.source.features.reduce<string[]>(
          (accum, feature) => {
            if (
              (feature.properties.restrictions?.master_travel_status ||
                'UNKNOWN') === 'MAJOR'
            ) {
              if (feature.properties.country_code === 'GB') {
                return [...accum, 'UK'];
              }
              return [...accum, feature.properties.country_code];
            }
            return accum;
          },
          [],
        ),
        moderateTravelRestrictions: restrictions.source.features.reduce<
          string[]
        >((accum, feature) => {
          if (
            (feature.properties.restrictions?.master_travel_status ||
              'UNKNOWN') === 'MODERATE'
          ) {
            if (feature.properties.country_code === 'GB') {
              return [...accum, 'UK'];
            }
            return [...accum, feature.properties.country_code];
          }
          return accum;
        }, []),
        visaOnArrivalCountries,
        visaFreeCountries,
        visaRequired,
        eVisa,
      }),
      firstLayer,
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

  /**
   * When the mapRef binds we need to bind some callbacks
   * Well add a callback to load our source data as well callbacks to handle the state of the map based on when things are done loading
   */
  React.useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }
    setMap(map);

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

    map.on('load', () => {
      setFirstLayer(getFirstSymbolIdFromMapLayers(map)); // keeps track of lowest layer so we can add our choropleth behind it
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

  // on initial page load set viewport and bind 'resize' listener
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
        dragRotate={false}
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
            const countryFeature = getCountryFeatureFromPointerEvent(e);
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
          <CountryPopup
            iso={iso}
            popupDetails={popupDetails}
            hoveredCountryDetail={hoveredCountryDetail}
            onClose={() => setPopupVisible(false)}
            restrictions={restrictions}
          />
        )}
      </ReactMapGL>
    </div>
  );
};

export default Map;
