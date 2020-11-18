export const getCountryCodeFromName = (countryName: string): string => {
  // edge cases from our formatted data:
  const country = countryCodeMap.find(
    (country) => country.name === countryName,
  );
  if (country) {
    return country.code;
  }
  throw new Error(`No Country Code found for: ${countryName}`);
};

export const getCountryNameFromCode = (code: string): string => {
  const country = countryCodeMap.find((country) => country.code === code);
  if (country) {
    return country.name;
  }
  throw new Error(`Couldnt find a country name for code: ${code}`);
};

export const countryCodeMap: { name: string; code: string; slug: string }[] = [
  { name: 'United States', code: 'US', slug: 'united-states' },
  { name: 'Uruguay', code: 'UY', slug: 'uruguay' },
  { name: 'Uzbekistan', code: 'UZ', slug: 'uzbekistan' },
  { name: 'Vatican City', code: 'VA', slug: 'vatican-city' },
  { name: 'Vanuatu', code: 'VU', slug: 'vanuatu' },
  { name: 'Venezuela', code: 'VE', slug: 'venezuela' },
  { name: 'Viet Nam', code: 'VN', slug: 'viet-nam' },
  { name: 'Western Sahara', code: 'EH', slug: 'western-sahara' },
  { name: 'Yemen', code: 'YE', slug: 'yemen' },
  { name: 'Zambia', code: 'ZM', slug: 'zambia' },
  { name: 'Zimbabwe', code: 'ZW', slug: 'zimbabwe' },
  { name: 'Afghanistan', code: 'AF', slug: 'afghanistan' },
  { name: 'Albania', code: 'AL', slug: 'albania' },
  { name: 'Algeria', code: 'DZ', slug: 'algeria' },
  { name: 'Andorra', code: 'AD', slug: 'andorra' },
  { name: 'Angola', code: 'AO', slug: 'angola' },
  { name: 'Antigua and Barbuda', code: 'AG', slug: 'antigua-and-barbuda' },
  { name: 'Argentina', code: 'AR', slug: 'argentina' },
  { name: 'Armenia', code: 'AM', slug: 'armenia' },
  { name: 'Australia', code: 'AU', slug: 'australia' },
  { name: 'Austria', code: 'AT', slug: 'austria' },
  { name: 'Azerbaijan', code: 'AZ', slug: 'azerbaijan' },
  { name: 'Bahamas', code: 'BS', slug: 'bahamas' },
  { name: 'Bahrain', code: 'BH', slug: 'bahrain' },
  { name: 'Bangladesh', code: 'BD', slug: 'bangladesh' },
  { name: 'Barbados', code: 'BB', slug: 'barbados' },
  { name: 'Belarus', code: 'BY', slug: 'belarus' },
  { name: 'Belgium', code: 'BE', slug: 'belgium' },
  { name: 'Belize', code: 'BZ', slug: 'belize' },
  { name: 'Benin', code: 'BJ', slug: 'benin' },
  { name: 'Bhutan', code: 'BT', slug: 'bhutan' },
  { name: 'Bolivia', code: 'BO', slug: 'bolivia' },
  {
    name: 'Bosnia and Herzegovina',
    code: 'BA',
    slug: 'bosnia-and-herzegovina',
  },
  { name: 'Botswana', code: 'BW', slug: 'botswana' },
  { name: 'Brazil', code: 'BR', slug: 'brazil' },
  { name: 'Brunei', code: 'BN', slug: 'brunei' },
  { name: 'Bulgaria', code: 'BG', slug: 'bulgaria' },
  { name: 'Burkina Faso', code: 'BF', slug: 'burkina-faso' },
  { name: 'Burundi', code: 'BI', slug: 'burundi' },
  { name: 'Cambodia', code: 'KH', slug: 'cambodia' },
  { name: 'Cameroon', code: 'CM', slug: 'cameroon' },
  { name: 'Canada', code: 'CA', slug: 'canada' },
  { name: 'Cape Verde', code: 'CV', slug: 'cape-verde' },
  {
    name: 'Central African Republic',
    code: 'CF',
    slug: 'central-african-republic',
  },
  { name: 'Chad', code: 'TD', slug: 'chad' },
  { name: 'Chile', code: 'CL', slug: 'chile' },
  { name: 'China', code: 'CN', slug: 'china' },
  { name: 'Colombia', code: 'CO', slug: 'colombia' },
  { name: 'Comoros', code: 'KM', slug: 'comoros' },
  { name: 'Costa Rica', code: 'CR', slug: 'costa-rica' },
  { name: 'Croatia', code: 'HR', slug: 'croatia' },
  { name: 'Cuba', code: 'CU', slug: 'cuba' },
  { name: 'Cyprus', code: 'CY', slug: 'cyprus' },
  { name: 'Czechia', code: 'CZ', slug: 'czechia' },
  { name: 'Congo (Dem. Rep.)', code: 'CD', slug: 'congo-(dem.-rep.)' },
  { name: 'Denmark', code: 'DK', slug: 'denmark' },
  { name: 'Djibouti', code: 'DJ', slug: 'djibouti' },
  { name: 'Dominica', code: 'DM', slug: 'dominica' },
  { name: 'Dominican Republic', code: 'DO', slug: 'dominican-republic' },
  { name: 'Timor Leste', code: 'TL', slug: 'timor-leste' },
  { name: 'Ecuador', code: 'EC', slug: 'ecuador' },
  { name: 'Egypt', code: 'EG', slug: 'egypt' },
  { name: 'El Salvador', code: 'SV', slug: 'el-salvador' },
  { name: 'Equatorial Guinea', code: 'GQ', slug: 'equatorial-guinea' },
  { name: 'Eritrea', code: 'ER', slug: 'eritrea' },
  { name: 'Estonia', code: 'EE', slug: 'estonia' },
  { name: 'Eswatini', code: 'SZ', slug: 'eswatini' },
  { name: 'Ethiopia', code: 'ET', slug: 'ethiopia' },
  { name: 'Falkland Islands', code: 'FK', slug: 'falkland-islands' },
  { name: 'Fiji', code: 'FJ', slug: 'fiji' },
  { name: 'Finland', code: 'FI', slug: 'finland' },
  { name: 'France', code: 'FR', slug: 'france' },
  { name: 'French Guiana', code: 'GF', slug: 'french-guiana' },
  { name: 'Gabon', code: 'GA', slug: 'gabon' },
  { name: 'Gambia', code: 'GM', slug: 'gambia' },
  { name: 'Georgia', code: 'GE', slug: 'georgia' },
  { name: 'Germany', code: 'DE', slug: 'germany' },
  { name: 'Ghana', code: 'GH', slug: 'ghana' },
  { name: 'Greece', code: 'GR', slug: 'greece' },
  { name: 'Greenland', code: 'GL', slug: 'greenland' },
  { name: 'Grenada', code: 'GD', slug: 'grenada' },
  { name: 'Guatemala', code: 'GT', slug: 'guatemala' },
  { name: 'Guinea', code: 'GN', slug: 'guinea' },
  { name: 'Guinea-Bissau', code: 'GW', slug: 'guinea-bissau' },
  { name: 'Guyana', code: 'GY', slug: 'guyana' },
  { name: 'Haiti', code: 'HT', slug: 'haiti' },
  { name: 'Honduras', code: 'HN', slug: 'honduras' },
  { name: 'Hong Kong', code: 'HK', slug: 'hong-kong' },
  { name: 'Hungary', code: 'HU', slug: 'hungary' },
  { name: 'Iceland', code: 'IS', slug: 'iceland' },
  { name: 'India', code: 'IN', slug: 'india' },
  { name: 'Indonesia', code: 'ID', slug: 'indonesia' },
  { name: 'Iran', code: 'IR', slug: 'iran' },
  { name: 'Iraq', code: 'IQ', slug: 'iraq' },
  { name: 'Ireland', code: 'IE', slug: 'ireland' },
  { name: 'Israel', code: 'IL', slug: 'israel' },
  { name: 'Italy', code: 'IT', slug: 'italy' },
  { name: "Cote d'Ivoire", code: 'CI', slug: "cote-d'ivoire" },
  { name: 'Jamaica', code: 'JM', slug: 'jamaica' },
  { name: 'Japan', code: 'JP', slug: 'japan' },
  { name: 'Jordan', code: 'JO', slug: 'jordan' },
  { name: 'Kazakhstan', code: 'KZ', slug: 'kazakhstan' },
  { name: 'Kenya', code: 'KE', slug: 'kenya' },
  { name: 'Kiribati', code: 'KI', slug: 'kiribati' },
  { name: 'Kosovo', code: 'XK', slug: 'kosovo' },
  { name: 'Kuwait', code: 'KW', slug: 'kuwait' },
  { name: 'Kyrgyzstan', code: 'KG', slug: 'kyrgyzstan' },
  { name: 'Laos', code: 'LA', slug: 'laos' },
  { name: 'Latvia', code: 'LV', slug: 'latvia' },
  { name: 'Lebanon', code: 'LB', slug: 'lebanon' },
  { name: 'Lesotho', code: 'LS', slug: 'lesotho' },
  { name: 'Liberia', code: 'LR', slug: 'liberia' },
  { name: 'Libya', code: 'LY', slug: 'libya' },
  { name: 'Liechtenstein', code: 'LI', slug: 'liechtenstein' },
  { name: 'Lithuania', code: 'LT', slug: 'lithuania' },
  { name: 'Luxembourg', code: 'LU', slug: 'luxembourg' },
  { name: 'Madagascar', code: 'MG', slug: 'madagascar' },
  { name: 'Malawi', code: 'MW', slug: 'malawi' },
  { name: 'Malaysia', code: 'MY', slug: 'malaysia' },
  { name: 'Maldives', code: 'MV', slug: 'maldives' },
  { name: 'Mali', code: 'ML', slug: 'mali' },
  { name: 'Malta', code: 'MT', slug: 'malta' },
  { name: 'Marshall Islands', code: 'MH', slug: 'marshall-islands' },
  { name: 'Mauritania', code: 'MR', slug: 'mauritania' },
  { name: 'Mauritius', code: 'MU', slug: 'mauritius' },
  { name: 'Mexico', code: 'MX', slug: 'mexico' },
  { name: 'Moldova', code: 'MD', slug: 'moldova' },
  { name: 'Monaco', code: 'MC', slug: 'monaco' },
  { name: 'Mongolia', code: 'MN', slug: 'mongolia' },
  { name: 'Montenegro', code: 'ME', slug: 'montenegro' },
  { name: 'Morocco', code: 'MA', slug: 'morocco' },
  { name: 'Mozambique', code: 'MZ', slug: 'mozambique' },
  { name: 'Myanmar', code: 'MM', slug: 'myanmar' },
  { name: 'Namibia', code: 'NA', slug: 'namibia' },
  { name: 'Nauru', code: 'NR', slug: 'nauru' },
  { name: 'Nepal', code: 'NP', slug: 'nepal' },
  { name: 'Netherlands', code: 'NL', slug: 'netherlands' },
  { name: 'New Caledonia', code: 'NC', slug: 'new-caledonia' },
  { name: 'New Zealand', code: 'NZ', slug: 'new-zealand' },
  { name: 'Nicaragua', code: 'NI', slug: 'nicaragua' },
  { name: 'Niger', code: 'NE', slug: 'niger' },
  { name: 'Nigeria', code: 'NG', slug: 'nigeria' },
  { name: 'North Korea', code: 'KP', slug: 'north-korea' },
  { name: 'North Macedonia', code: 'MK', slug: 'north-macedonia' },
  { name: 'Norway', code: 'NO', slug: 'norway' },
  { name: 'Oman', code: 'OM', slug: 'oman' },
  { name: 'Pakistan', code: 'PK', slug: 'pakistan' },
  { name: 'Palau', code: 'PW', slug: 'palau' },
  {
    name: 'Palestinian Territories',
    code: 'PS',
    slug: 'palestinian-territories',
  },
  { name: 'Panama', code: 'PA', slug: 'panama' },
  { name: 'Papua New Guinea', code: 'PG', slug: 'papua-new-guinea' },
  { name: 'Paraguay', code: 'PY', slug: 'paraguay' },
  { name: 'Peru', code: 'PE', slug: 'peru' },
  { name: 'Philippines', code: 'PH', slug: 'philippines' },
  { name: 'Poland', code: 'PL', slug: 'poland' },
  { name: 'Portugal', code: 'PT', slug: 'portugal' },
  { name: 'Puerto Rico', code: 'PR', slug: 'puerto-rico' },
  { name: 'Qatar', code: 'QA', slug: 'qatar' },
  { name: 'Congo', code: 'CG', slug: 'congo' },
  { name: 'Romania', code: 'RO', slug: 'romania' },
  { name: 'Russian Federation', code: 'RU', slug: 'russian-federation' },
  { name: 'Rwanda', code: 'RW', slug: 'rwanda' },
  { name: 'Saint Kitts and Nevis', code: 'KN', slug: 'saint-kitts-and-nevis' },
  { name: 'Saint Lucia', code: 'LC', slug: 'saint-lucia' },
  {
    name: 'St. Vincent and the Grenadines',
    code: 'VC',
    slug: 'st.-vincent-and-the-grenadines',
  },
  { name: 'Samoa', code: 'WS', slug: 'samoa' },
  { name: 'San Marino', code: 'SM', slug: 'san-marino' },
  { name: 'Sao Tome and Principe', code: 'ST', slug: 'sao-tome-and-principe' },
  { name: 'Saudi Arabia', code: 'SA', slug: 'saudi-arabia' },
  { name: 'Senegal', code: 'SN', slug: 'senegal' },
  { name: 'Serbia', code: 'RS', slug: 'serbia' },
  { name: 'Seychelles', code: 'SC', slug: 'seychelles' },
  { name: 'Sierra Leone', code: 'SL', slug: 'sierra-leone' },
  { name: 'Singapore', code: 'SG', slug: 'singapore' },
  { name: 'Slovakia', code: 'SK', slug: 'slovakia' },
  { name: 'Slovenia', code: 'SI', slug: 'slovenia' },
  { name: 'Solomon Islands', code: 'SB', slug: 'solomon-islands' },
  { name: 'Somalia', code: 'SO', slug: 'somalia' },
  { name: 'South Africa', code: 'ZA', slug: 'south-africa' },
  { name: 'South Korea', code: 'KR', slug: 'south-korea' },
  { name: 'South Sudan', code: 'SS', slug: 'south-sudan' },
  { name: 'Spain', code: 'ES', slug: 'spain' },
  { name: 'Sri Lanka', code: 'LK', slug: 'sri-lanka' },
  { name: 'Sudan', code: 'SD', slug: 'sudan' },
  { name: 'Suriname', code: 'SR', slug: 'suriname' },
  { name: 'Sweden', code: 'SE', slug: 'sweden' },
  { name: 'Switzerland', code: 'CH', slug: 'switzerland' },
  { name: 'Syria', code: 'SY', slug: 'syria' },
  { name: 'Taiwan', code: 'TW', slug: 'taiwan' },
  { name: 'Tajikistan', code: 'TJ', slug: 'tajikistan' },
  { name: 'Tanzania', code: 'TZ', slug: 'tanzania' },
  { name: 'Thailand', code: 'TH', slug: 'thailand' },
  { name: 'Togo', code: 'TG', slug: 'togo' },
  { name: 'Tonga', code: 'TO', slug: 'tonga' },
  { name: 'Trinidad and Tobago', code: 'TT', slug: 'trinidad-and-tobago' },
  { name: 'Tunisia', code: 'TN', slug: 'tunisia' },
  { name: 'Turkey', code: 'TR', slug: 'turkey' },
  { name: 'Turkmenistan', code: 'TM', slug: 'turkmenistan' },
  { name: 'Tuvalu', code: 'TV', slug: 'tuvalu' },
  { name: 'Uganda', code: 'UG', slug: 'uganda' },
  { name: 'Ukraine', code: 'UA', slug: 'ukraine' },
  { name: 'United Arab Emirates', code: 'AE', slug: 'united-arab-emirates' },
  { name: 'United Kingdom', code: 'GB', slug: 'united-kingdom' },
];
