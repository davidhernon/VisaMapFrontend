interface ColorSet {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}
export interface Theme {
  theme: {
    extend: {
      colors: {
        'no-data': string;
        required: string;
        'on-arrival': string;
        'e-visa': string;
        'visa-free': string;
        'covid-ban': string;
      };
      gray: ColorSet;
      red: ColorSet;
      amber: ColorSet;
      emerald: ColorSet;
      blue: ColorSet;
      indigo: ColorSet;
      purple: ColorSet;
      pink: ColorSet;
      green: ColorSet;
    };
  };
}
