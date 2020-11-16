const LegendItem: React.FC<{
  value?: string | number;
  description: string;
}> = ({ value, description }) => (
  <div className="flex items-center">
    <div className="rounded bg-blue-500">{value && value}</div>
    <div>{description}</div>
  </div>
);

export default LegendItem;
