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
import Markdown from '@src/components/Markdown';

enum TravelStatus {
  MAJOR = 'MAJOR', // '🚨',
  MODERATE = 'MODERATE', //'🚧',
  LOW = 'LOW', // '❎',
  UNKNOWN = 'UNKNOWN',
}

const TravelStatusLabel: React.FC = ({ children }) => (
  <span className="text-sm border-2 text-gray-600 p-1 rounded font-bold">
    {children}
  </span>
);

const getTravelStatusIcon = (status: TravelStatus) => {
  switch (status) {
    case TravelStatus.MAJOR:
      return <TravelStatusLabel>Major restrictions 🚨</TravelStatusLabel>;
    case TravelStatus.MODERATE:
      return <TravelStatusLabel>Moderate restrictions 🚧</TravelStatusLabel>;
    case TravelStatus.LOW:
      return <TravelStatusLabel>Low restrictions ❎</TravelStatusLabel>;
    default:
      return '';
  }
};

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
      captureScroll={true}
      className="w-1/2 h-1/2 p-0"
      latitude={popupDetails.lngLat[1]}
      longitude={popupDetails.lngLat[0]}
      closeButton={false}
      closeOnClick={false}
      onClose={() => onClose()}
      anchor="top"
    >
      <div>
        <div className="p-2">
          <div className="flex justify-between">
            <h3 className="font-bold">
              {hoveredCountryDetail
                ? getCountryNameFromCode(hoveredCountryDetail.code)
                : 'No Data'}
            </h3>
            {feature && (
              <div>
                {getTravelStatusIcon(
                  feature.properties.restrictions
                    .master_travel_status as TravelStatus,
                )}
              </div>
            )}
          </div>
          {hoveredCountryDetail && (
            <div>
              {(hoveredCountryDetail.details.covidBan ||
                (feature &&
                  feature.properties.restrictions
                    .destination_self_isolation_translation ===
                    'Quarantine required')) && (
                <LegendItem
                  color={colors['brick-red'][500]}
                  description={`Travel ban`}
                />
              )}
              {hoveredCountryDetail.details.eVisa && (
                <LegendItem
                  color={colors['picton-blue'][500]}
                  description={`E-Visa available`}
                />
              )}
              {hoveredCountryDetail.details.visaOnArrival && (
                <LegendItem
                  color={colors['picton-blue'][700]}
                  description={`Visa available on arrival`}
                />
              )}
              {hoveredCountryDetail.details.visaRequired && (
                <LegendItem
                  color={colors['yellow-sea'][500]}
                  description={`Visa Required`}
                />
              )}
              {!hoveredCountryDetail.details.visaRequired &&
                !hoveredCountryDetail.details.covidBan &&
                !(
                  feature &&
                  feature.properties.restrictions
                    .destination_self_isolation_translation ===
                    'Quarantine required'
                ) && (
                  <LegendItem
                    color={colors.emerald[500]}
                    description={`Travel possible`}
                  />
                )}
            </div>
          )}
        </div>
        {feature && (
          <div className="overflow-y-scroll h-40 p-2 border-t border-gray-400">
            <div className="font-bold text-gray-700 pb-1">
              <div>
                🛫{' '}
                {
                  feature.properties.restrictions
                    .destination_self_isolation_translation
                }
                {' on arrival.'}
              </div>
              <div>
                🛬{' '}
                {
                  feature.properties.restrictions
                    .return_self_isolation_translation
                }
                {' on return.'}
              </div>
            </div>
            <div>
              <Markdown>
                {
                  feature.properties.restrictions
                    .destination_restrictions_commentary_translation
                }
              </Markdown>
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
};
export default CountryPopup;
