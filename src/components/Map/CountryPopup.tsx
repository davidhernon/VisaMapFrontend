import { Popup } from 'react-map-gl';
import LegendItem from '@src/components/Legend/LegendItem';
import { getCountryNameFromCode } from '@src/utils/country-mapping';
import { CountryDetails } from 'types/map-types';
import { colors } from '@src/utils/theme';

const CountryPopup: React.FC<{
  iso: string;
  popupDetails: { lngLat: [number, number] };
  hoveredCountryDetail: CountryDetails;
  onClose: () => void;
}> = ({ iso, popupDetails, hoveredCountryDetail, onClose }) => (
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
          <LegendItem color={colors.required} description={`Visa Required`} />
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
);
export default CountryPopup;
