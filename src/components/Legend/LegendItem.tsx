const LegendItem: React.FC<{
  color?: string;
  description: string;
  value?: string | number;
}> = ({ color, description, value }) => (
  <div className="flex-initial flex items-center mr-4">
    <div style={{ backgroundColor: color }} className="rounded w-4 h-4">
      {value && value}
    </div>
    <div className="ml-2">{description}</div>
  </div>
);

export default LegendItem;
