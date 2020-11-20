import { colors } from '@src/utils/theme';
import debounce from 'lodash.debounce';
import { PointerEvent } from 'react-map-gl';
import { CountryDetails } from 'types/map-types';
import { CountryTravelRestriction } from 'types/travel-restrictions-types';

export const COUNTRY_LAYER_ID = 'country-status';

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

export const setHoveredCountry = debounce(
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
      (feature) => feature.layer.id === COUNTRY_LAYER_ID,
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
export const includesField = (field: string) => (
  array: (string | number)[],
) => ['in', ['get', field], ['literal', array]];

export const includesIso = includesField('ISO_A2');

export const getCountryStatusSets = (countryDetailsList: CountryDetails[]) => {
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

  return {
    covidBannedCountries,
    visaFreeCountries,
    eVisa,
    visaOnArrivalCountries,
    visaRequired,
  };
};

export const getCountryFeatureFromPointerEvent = (e: PointerEvent) =>
  e.features &&
  e.features.find((feature) => feature.layer.id === COUNTRY_LAYER_ID);

interface getCountryStatusLayerProps {
  hoveredFeatureId: string | number | null;
  lowTravelRestrictions: string[]; //array of iso2 codes
  majorTravelRestrictions: string[]; //array of iso2 codes
  moderateTravelRestrictions: string[]; //array of iso2 codes
  covidBannedCountries: string[];
  visaOnArrivalCountries: string[];
  visaFreeCountries: string[];
  visaRequired: string[];
  eVisa: string[];
}
// Visa free, Major (lighter red), Moderate (pale green), None (green)
// E-Visa, Major (lighter red), Moderate (picton blue), Low (deep blue), None deep blue
// On Arrival (lighter red), Moderate (picton blue), Low (deep blue), None deep blue
// Visa Required major (red), moderate (lightest red), Low (yellow-sea), None (yellow sea)
export const getCountryStatusLayer = ({
  hoveredFeatureId,
  lowTravelRestrictions,
  majorTravelRestrictions,
  moderateTravelRestrictions,
  covidBannedCountries,
  visaOnArrivalCountries,
  visaFreeCountries,
  visaRequired,
  eVisa,
}: getCountryStatusLayerProps): mapboxgl.Layer => {
  return {
    id: 'country-status',
    source: countryDataSource.id,
    type: 'fill',
    paint: {
      'fill-color': [
        'case',
        includesIso(covidBannedCountries), // banned countries coloured red
        colors['brick-red'][500],
        ['all', includesIso(eVisa), includesIso(majorTravelRestrictions)], // e visa, major
        colors['brick-red'][400],
        ['all', includesIso(eVisa), includesIso(moderateTravelRestrictions)], // evisa, moderate
        colors['yellow-sea'][400],
        ['all', includesIso(eVisa), includesIso(lowTravelRestrictions)], // evisa, low
        colors['picton-blue'][500],
        includesIso(eVisa), // unkown restrictions, eVisa country
        colors['picton-blue'][500],
        [
          'all',
          includesIso(visaOnArrivalCountries),
          includesIso(majorTravelRestrictions),
        ], // arrival visa, major
        colors['brick-red'][400],
        [
          'all',
          includesIso(visaOnArrivalCountries),
          includesIso(moderateTravelRestrictions),
        ], // arrival visa, moderate
        colors['yellow-sea'][400],
        [
          'all',
          includesIso(visaOnArrivalCountries),
          includesIso(lowTravelRestrictions),
        ], // arrival visa, low
        colors['picton-blue'][500],
        includesIso(visaOnArrivalCountries), // unkown restrictions, arrival visa country
        colors['picton-blue'][500],
        // do colors here
        [
          'all',
          includesIso(visaRequired),
          includesIso(majorTravelRestrictions),
        ], // arrival visa, major
        colors['brick-red'][400],
        [
          'all',
          includesIso(visaRequired),
          includesIso(moderateTravelRestrictions),
        ], // arrival visa, moderate
        colors['yellow-sea'][500],
        ['all', includesIso(visaRequired), includesIso(lowTravelRestrictions)], // arrival visa, low
        colors['yellow-sea'][400],
        includesIso(visaRequired), // unkown restrictions, arrival visa country
        colors['yellow-sea'][300],
        [
          'all',
          includesIso(visaFreeCountries),
          includesIso(majorTravelRestrictions),
        ], // arrival visa, major
        colors.emerald[200],
        [
          'all',
          includesIso(visaFreeCountries),
          includesIso(moderateTravelRestrictions),
        ], // arrival visa, moderate
        colors.emerald[400],
        [
          'all',
          includesIso(visaFreeCountries),
          includesIso(lowTravelRestrictions),
        ], // arrival visa, low
        colors.emerald[500],
        includesIso(visaFreeCountries), // unkown restrictions, arrival visa country
        colors.emerald[600],
        colors['gull-gray'][500],
      ],
      'fill-outline-color': '#F2F2F2',
      'fill-opacity': [
        'case',
        ['==', ['get', 'ISO_A2'], hoveredFeatureId],
        1,
        0.75,
      ],
    },
  };
};

export const getFirstSymbolIdFromMapLayers = (map: mapboxgl.Map) => {
  var layers = map.getStyle().layers || [];
  // Find the index of the first symbol layer in the map style
  var firstSymbolId = 'country-label-sm'; // a known label to start
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol') {
      firstSymbolId = layers[i].id;
      break;
    }
  }
  return firstSymbolId;
};
