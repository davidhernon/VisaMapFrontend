import LegendItem from './LegendItem';

const LegendItems = [
  {
    description: 'Covid-19 Entry Ban',
    color: '#b73849',
  },
  {
    description: 'Visa Free',
    color: '#2bd47d',
  },
  {
    description: 'E-Visa',
    color: '#64b5f6',
  },
  {
    description: 'Visa On Arrival',
    color: '#1381b5',
  },
  {
    description: 'Visa Required',
    color: '#ffab00',
  },
  {
    description: 'No Data',
    color: '#90a4ae',
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
