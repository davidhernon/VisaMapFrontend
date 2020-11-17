import React from 'react';
import Map from '@src/components/Map';
import { CountryDetails } from 'types/map-types';
import { convertCountryDetailModuleToList } from '@src/utils/json-data-utils';
import { useRouter } from 'next/dist/client/router';
import { getCountryNameFromCode } from '@src/utils/country-mapping';
import IsoSelector from '@src/components/IsoSelector';
import Legend from '@src/components/Legend/Legend';

const Home: React.FC<{ iso?: string }> = ({ iso = 'US' }) => {
  const { MAPBOX_TOKEN } = process.env; // https://github.com/vercel/next.js/issues/6888
  const router = useRouter();
  const path = router.pathname;
  const [countryDetailsList, setCountryDetailsList] = React.useState<
    CountryDetails[]
  >([]);
  React.useEffect(() => {
    import(`../../../public/json/${iso}.json`).then((countryDetailModule) => {
      const countryDetailsList = convertCountryDetailModuleToList(
        countryDetailModule,
      ).filter((cd) => cd !== undefined);
      setCountryDetailsList(countryDetailsList);
    });
  }, [iso]);

  return (
    <>
      <div className="m-2 z-20 bg-white p-2 w-full-pad pr-4 md:absolute md:w-35">
        <h1 data-testid="helloH1" className="text-xl text-gray-900">
          Visa Restrictions for {getCountryNameFromCode(iso)}
        </h1>
        <IsoSelector
          iso={iso}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            router.replace(`${path}?iso=${e.target.value}`)
          }
        />
        <Legend />
      </div>
      {MAPBOX_TOKEN && (
        <Map
          countryDetailsList={countryDetailsList}
          iso={iso}
          token={MAPBOX_TOKEN}
        ></Map>
      )}
    </>
  );
};

export default Home;
