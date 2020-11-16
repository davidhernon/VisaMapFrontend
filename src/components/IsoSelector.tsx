import React from 'react'
import { countryCodeMap } from '@src/utils/country-mapping'

const IsoSelector: React.FC<{ iso: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({
  iso,
  onChange,
}) => (
  <select name="iso" onChange={onChange}>
    {countryCodeMap.map(({ code, name }) => (
      <option key={code} value={code} selected={iso === code.toUpperCase()}>
        {name}
      </option>
    ))}
  </select>
)

export default IsoSelector
