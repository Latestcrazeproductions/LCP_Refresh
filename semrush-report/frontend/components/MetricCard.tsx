'use client';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function MetricCard({ label, value, trend = 'neutral' }: MetricCardProps) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {trend !== 'neutral' && (
        <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? '↑' : '↓'}
        </p>
      )}
    </div>
  );
}
