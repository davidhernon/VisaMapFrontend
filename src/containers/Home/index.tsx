import React from 'react';
import Map from '@src/components/Map';
import { CountryDetails } from 'types/map-types';
import { convertCountryDetailModuleToList } from '@src/utils/json-data-utils';
import {
  getCountryNameFromCode,
  getSlugFromCode,
} from '@src/utils/country-mapping';
import Legend from '@src/components/Legend/Legend';
import {
  getRestrictions,
  placeholderRestrictions,
} from '@src/services/travel-restriction-api';
import { CountryTravelRestriction } from 'types/travel-restrictions-types';
import { useRouter } from 'next/dist/client/router';
import RouteIsoSelector from '@src/components/Select/RouteIsoSelector';

const Home = () => {
  /**
   * Deprecated: migrate to use a store intead
   * Use store drive by RouteIsoSelector
   */
  const router = useRouter();
  const path = router.pathname;
  const { iso } = router.query;
  const isoFormatted = typeof iso === 'string' ? iso.toUpperCase() : 'US';
  //
  const { MAPBOX_TOKEN } = process.env; // https://github.com/vercel/next.js/issues/6888
  const [countryDetailsList, setCountryDetailsList] = React.useState<
    CountryDetails[]
  >([]);
  const [restrictions, setRestrictions] = React.useState<
    CountryTravelRestriction
  >(placeholderRestrictions);
  React.useEffect(() => {
    getRestrictions(getSlugFromCode(isoFormatted)).then((restrictions) =>
      setRestrictions(restrictions),
    );
    import(`../../../public/json/${isoFormatted}.json`).then(
      (countryDetailModule) => {
        const countryDetailsList = convertCountryDetailModuleToList(
          countryDetailModule,
        ).filter((cd) => cd !== undefined);
        setCountryDetailsList(countryDetailsList);
      },
    );
  }, [isoFormatted]);

  return (
    <>
      <div className="m-2 z-20 bg-white p-2 w-full-pad pr-4 md:absolute md:w-35">
        <h1 data-testid="helloH1" className="text-xl text-gray-900">
          Visa Restrictions for {getCountryNameFromCode(isoFormatted)}
        </h1>
        <RouteIsoSelector />
        <Legend />
      </div>
      {MAPBOX_TOKEN && (
        <Map
          countryDetailsList={countryDetailsList}
          restrictions={restrictions}
          iso={isoFormatted}
          token={MAPBOX_TOKEN}
        ></Map>
      )}
    </>
  );
};

export default Home;
