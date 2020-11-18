import { CountryDetails } from 'types/map-types';

export const getWindowSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const getCovidBannedCountries = (countryDetails: CountryDetails[]) =>
  countryDetails
    .filter(({ details: { covidBan } }) => covidBan)
    .map(({ code }) => code);

export const getVisaFreeCountries = (countryDetails: CountryDetails[]) =>
  countryDetails
    .filter(({ details }) => !details.visaRequired)
    .map(({ code }) => code);

export const getVisaOnArrivalCountries = (countryDetails: CountryDetails[]) =>
  countryDetails
    .filter(({ details: { visaOnArrival } }) => visaOnArrival)
    .map(({ code }) => code);

export const getVisaRequiredCountries = (countryDetails: CountryDetails[]) =>
  countryDetails
    .filter(({ details: { visaRequired } }) => visaRequired)
    .map(({ code }) => code);

export const getEVisaCountries = (countryDetails: CountryDetails[]) =>
  countryDetails
    .filter(({ details: { eVisa } }) => eVisa)
    .map(({ code }) => code);
