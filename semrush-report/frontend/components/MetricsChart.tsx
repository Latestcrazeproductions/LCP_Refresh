'use client';

interface MetricsChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  type: 'line' | 'bar';
}

export default function MetricsChart({ data, xKey, yKey, type }: MetricsChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-gray-400">No data available</p>;
  }

  // Simple chart rendering (can be enhanced with Recharts or Chart.js)
  const maxValue = Math.max(...data.map((d) => Number(d[yKey]) || 0));
  const minValue = Math.min(...data.map((d) => Number(d[yKey]) || 0));
  const range = maxValue - minValue || 1;

  return (
    <div className="w-full">
      <div className="h-64 flex items-end gap-1">
        {data.map((item, index) => {
          const value = Number(item[yKey]) || 0;
          const height = ((value - minValue) / range) * 100;
          
          return (
            <div
              key={index}
              className="flex-1 bg-blue-600 hover:bg-blue-500 transition-colors rounded-t"
              style={{ height: `${Math.max(height, 5)}%` }}
              title={`${item[xKey]}: ${value.toLocaleString()}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{data[0]?.[xKey]}</span>
        <span>{data[data.length - 1]?.[xKey]}</span>
      </div>
    </div>
  );
}
