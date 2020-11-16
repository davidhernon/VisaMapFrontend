module.exports = {
  purge: {
    content: ['./pages/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  },
  theme: {
    extend: {
      colors: {
        'no-data': '#90a4ae',
        'required': '#ffab00', 
        'on-arrival': '#1381b5',
        'e-visa': '#64b5f6',
        'visa-free': '#2bd47d',
        'covid-ban': '#b73849'
      },
      flex: {
        'auto-1/2': '1 50%'
      },
      width: {
        '35': '35%'
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
