import React from 'react';
import { countryCodeMap } from '@src/utils/country-mapping';

const CountrySelect: React.FC<{
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ defaultValue, onChange }) => (
  <select
    className="w-full bg-gray-300"
    name="iso"
    onChange={onChange}
    defaultValue={defaultValue}
  >
    {countryCodeMap.map(({ code, name }) => (
      <option key={code} value={code}>
        {name}
      </option>
    ))}
  </select>
);

export default CountrySelect;
