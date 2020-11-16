import React from 'react';
import { countryCodeMap } from '@src/utils/country-mapping';

const IsoSelector: React.FC<{
  iso: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ iso, onChange }) => (
  <select
    className="w-full bg-gray-300"
    name="iso"
    onChange={onChange}
    defaultValue={iso}
  >
    {countryCodeMap.map(({ code, name }) => (
      <option key={code} value={code}>
        {name}
      </option>
    ))}
  </select>
);

export default IsoSelector;
