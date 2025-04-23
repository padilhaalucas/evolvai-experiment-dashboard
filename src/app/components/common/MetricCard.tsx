interface MetricCardProps {
  title: string;
  value: string;
  subtext?: string;
  change?: number;
}

export function MetricCard({
  title,
  value,
  subtext,
  change
}: MetricCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="mt-1 flex items-baseline">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        {change !== undefined && (
          <span
            className={`ml-2 text-sm font-medium ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        )}
      </div>
      {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
    </div>
  );
}
