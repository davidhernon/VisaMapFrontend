export interface CountryDetails {
    code: string // 2 letter country ISO code, etc; 'US'
    details: {
      covidBan: boolean
      eVisa: boolean
      length: null | number
      visaOnArrival: boolean
      visaRequired: boolean
    }
  }