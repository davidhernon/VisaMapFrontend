module.exports = {
  purge: {
    content: ['./pages/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  },
  theme: {
    extend: {
      colors: {
        // 'no-data': '#90a4ae',
        // 'required': '#ffab00', 
        // 'on-arrival': '#1381b5',
        // 'e-visa': '#64b5f6',
        // 'visa-free': '#2bd47d',
        // 'covid-ban': '#b73849',
        'emerald': {
          50: '#F4FDF9',
          100: '#EAFBF2',
          200: '#CAF4DF',
          300: '#AAEECB',
          400: '#6BE1A4',
          500: '#2BD47D',
          600: '#27BF71',
          700: '#1A7F4B',
          800: '#135F38',
          900: '#0D4026',
          },
        'picton-blue': {
          50: '#F7FBFF',
          100: '#F0F8FE',
          200: '#D8EDFD',
          300: '#C1E1FB',
          400: '#93CBF9',
          500: '#64B5F6',
          600: '#5AA3DD',
          700: '#3C6D94',
          800: '#2D516F',
          900: '#1E364A',
          },
        'brick-red': {
          50: '#FBF5F6',
          100: '#F8EBED',
          200: '#EDCDD2',
          300: '#E2AFB6',
          400: '#CD7480',
          500: '#B73849',
          600: '#A53242',
          700: '#6E222C',
          800: '#521921',
          900: '#371116',
          },
        'gull-gray': {
          50: '#F9FAFB',
          100: '#F4F6F7',
          200: '#E3E8EB',
          300: '#D3DBDF',
          400: '#B1BFC6',
          500: '#90A4AE',
          600: '#82949D',
          700: '#566268',
          800: '#414A4E',
          900: '#2B3134',
          },
          'yellow-sea': {
            50: '#FFFBF2',
            100: '#FFF7E6',
            200: '#FFEABF',
            300: '#FFDD99',
            400: '#FFC44D',
            500: '#FFAB00',
            600: '#E69A00',
            700: '#996700',
            800: '#734D00',
            900: '#4D3300',
            },
      },
      flex: {
        'auto-1/2': '1 50%'
      },
      width: {
        '35': '35%',
        'full-pad': 'calc(100% - 0.5rem);'
      },
    },
  },
  variants: {},
  plugins: [],
  /**
   * Only have the one below till TailwindCSS V2.0 releases:
   * https://tailwindcss.com/docs/upcoming-changes#remove-deprecated-gap-utilities.
   */
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
}
