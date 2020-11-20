import { colors } from '@src/utils/theme';
import LegendItem from './LegendItem';

const LegendItems = [
  {
    description: 'Covid-19 Ban',
    color: colors['brick-red'][500],
  },
  {
    description: 'Visa Free',
    color: colors.emerald[500],
  },
  {
    description: 'E-Visa',
    color: colors['picton-blue'][500],
  },
  {
    description: 'Visa On Arrival',
    color: colors['picton-blue'][700],
  },
  {
    description: 'Visa Required',
    color: colors['yellow-sea'][500],
  },
  {
    description: 'No Data',
    color: colors['gull-gray'][500],
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
