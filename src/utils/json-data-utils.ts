import { CountryDetails } from "types/map-types"

export const convertCountryDetailModuleToList = (module: any) => {
    let countryDetailsList: CountryDetails[] = []
    for (let i = 0; i < 200; i++) {
      const countryDetail = module[i]
      if (typeof countryDetail === undefined) {
        return countryDetailsList
      }
      countryDetailsList.push(countryDetail)
    }
    return countryDetailsList
  }