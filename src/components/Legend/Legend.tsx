import { colors } from '@src/utils/theme';
import LegendItem from './LegendItem';

const LegendItems = [
  {
    description: 'Covid-19 Ban',
    color: colors['covid-ban'],
  },
  {
    description: 'Visa Free',
    color: colors['visa-free'],
  },
  {
    description: 'E-Visa',
    color: colors['e-visa'],
  },
  {
    description: 'Visa On Arrival',
    color: colors['on-arrival'],
  },
  {
    description: 'Visa Required',
    color: colors.required,
  },
  {
    description: 'No Data',
    color: colors['no-data'],
  },
];

const Legend = () => (
  <div className="flex flex-wrap mt-2">
    {LegendItems.map(({ color, description }) => (
      <LegendItem key={description} color={color} description={description} />
    ))}
  </div>
);

export default Legend;
