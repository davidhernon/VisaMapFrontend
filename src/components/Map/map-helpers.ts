import debounce from "lodash.debounce";
import { PointerEvent } from "react-map-gl";
import { CountryDetails } from "types/map-types";

export const COUNTRY_LAYER_ID = 'country-status'

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
export const includesField = (field: string) => (array: (string | number)[]) => [
    'in',
    ['get', field],
    ['literal', array],
  ];
  
export  const includesIso = includesField('ISO_A2');

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
        visaRequired
    }
}

export const getCountryFeatureFromPointerEvent = (e: PointerEvent) =>
e.features &&
e.features.find(
  (feature) => feature.layer.id === COUNTRY_LAYER_ID,
);