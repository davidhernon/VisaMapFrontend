import LegendItem from './LegendItem';

const Legend: React.FC<{
  items: { value: undefined | string | number; description: string }[];
}> = ({ items }) => (
  <>
    {items.map(({ value, description }) => (
      <LegendItem key={description} value={value} description={description} />
    ))}
  </>
);

export default Legend;
