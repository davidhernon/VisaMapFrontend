import React from 'react';
import { Popup } from 'react-map-gl';
import LegendItem from '@src/components/Legend/LegendItem';
import { getCountryNameFromCode } from '@src/utils/country-mapping';
import { CountryDetails } from 'types/map-types';
import { colors } from '@src/utils/theme';
import {
  CountryTravelRestriction,
  Feature,
} from 'types/travel-restrictions-types';
import { features } from 'process';

const CountryPopup: React.FC<{
  iso: string;
  popupDetails: { lngLat: [number, number] };
  hoveredCountryDetail: CountryDetails;
  onClose: () => void;
  restrictions: CountryTravelRestriction;
}> = ({ iso, popupDetails, hoveredCountryDetail, onClose, restrictions }) => {
  const [feature, setFeature] = React.useState<undefined | Feature>(undefined);
  React.useEffect(() => {
    new Promise<Feature>((resolve) => {
      /**
       * @todo fix workaround for UK citizens
       * GB is the country code for our passport info but UK is the code for travel restrictions
       * We added a harcoded fallback for this case
       */
      if (hoveredCountryDetail && hoveredCountryDetail.code === 'GB') {
        const ukRestrictions = restrictions.source.features.find((feature) => {
          return feature.properties.country_code === 'UK';
        });
        resolve(ukRestrictions);
        return;
      } // end workaround

      const countryRestrictions = restrictions.source.features.find(
        (feature) => {
          return feature.properties.country_code === hoveredCountryDetail.code;
        },
      );
      resolve(countryRestrictions);
    }).then((countryRestrictions) => {
      setFeature(countryRestrictions);
    });
  }, [hoveredCountryDetail]);
  return (
    <Popup
      latitude={popupDetails.lngLat[1]}
      longitude={popupDetails.lngLat[0]}
      closeButton={false}
      closeOnClick={false}
      onClose={() => onClose()}
      anchor="top"
    >
      <div>
        <h3 className="font-bold">
          {hoveredCountryDetail
            ? getCountryNameFromCode(hoveredCountryDetail.code)
            : 'No Data'}
        </h3>
        {hoveredCountryDetail && (
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
        )}
        {feature && (
          <>
            <div>
              status: {feature.properties.restrictions.master_travel_status}
            </div>
            <div>
              Travel Quarantine:
              {
                feature.properties.restrictions
                  .destination_self_isolation_translation
              }
            </div>
            <div>
              Return Quarantine:
              {
                feature.properties.restrictions
                  .return_self_isolation_translation
              }
            </div>
            <div>
              {feature.properties.restrictions.entry_restrictions_translation}
            </div>
            <div>
              {
                feature.properties.restrictions
                  .destination_restrictions_commentary_translation
              }
            </div>
          </>
        )}
      </div>
    </Popup>
  );
};
export default CountryPopup;
