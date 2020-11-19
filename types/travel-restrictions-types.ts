export interface Summary {
  MAJOR: number;
  MODERATE: number;
  LOW: number;
  UNKNOWN: number;
}

export interface Geometry {
  type: string;
  coordinates: any[][][];
}

export interface Centroid {
  lat: number;
  lng: number;
}

export interface DestinationSafetyStatus {
  status: string;
  cases_delta_7_days: number;
  cases_lag_recent_7_days: number;
  cases_lag_previous_7_days: number;
  cases_delta_percent_7_days: number;
  cases_lag_recent_7_days_per100k: number;
  cases_lag_previous_7_days_per100k: number;
  population: number;
}

export interface Restrictions {
  master_travel_status: string;
  master_travel_restrictions_translation: string;
  destination_self_isolation: string;
  destination_self_isolation_translation: string;
  return_self_isolation: string;
  return_self_isolation_translation: string;
  entry_restrictions: string;
  entry_restrictions_translation: string;
  destination_restrictions_commentary: string;
  destination_restrictions_commentary_translation: string;
  last_updated: Date;
  updated_restrictions: string[];
  destination_safety_status: DestinationSafetyStatus;
}

export interface Properties {
  country_id: string;
  country_name: string;
  country_code: string;
  centroid: Centroid;
  restrictions: Restrictions;
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Source {
  type: string;
  dataset_last_updated: Date;
  summary: Summary;
  features: Feature[];
}

export interface CountryTravelRestriction {
  host: string;
  countrySlug: string;
  url: string;
  source: Source;
}
