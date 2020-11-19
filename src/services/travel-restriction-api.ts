// import { get } from '@src/services/travel-restriction-api';

import { get } from '@src/utils/request-helpers';
import { CountryTravelRestriction } from 'types/travel-restrictions-types';
const { TRAVEL_API_URL } = process.env;

export const placeholderRestrictions: CountryTravelRestriction = {
  host: 'placeholder',
  countrySlug: 'atlantis',
  url: '',
  source: {
    type: 'placeholder',
    dataset_last_updated: new Date(),
    summary: {
      MAJOR: 0,
      MODERATE: 0,
      LOW: 0,
      UNKNOWN: 0,
    },
    features: [],
  },
};

/**
 * For a given slug it GETs our restriction api data
 * @param slug string, url safe string that maps to a single country (united-states for "United States")
 */
export const getRestrictions = async (slug: string) => {
  return await (
    await get<CountryTravelRestriction>(`${TRAVEL_API_URL}/${slug}`)
  ).json();
};
