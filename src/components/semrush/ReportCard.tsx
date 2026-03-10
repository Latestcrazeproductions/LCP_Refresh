'use client';

import type { Report } from '@/lib/semrush-api';

interface ReportCardProps {
  report: Report;
  exportUrl: string;
  onView: () => void;
  onDelete: () => void;
}

export default function ReportCard({ report, exportUrl, onView, onDelete }: ReportCardProps) {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="text-xl font-semibold">{report.domain}</h3>
              <p className="text-sm text-gray-400">Generated: {formatDate(report.generated_at)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Size: {formatSize(report.size)} • Modified: {formatDate(report.modified)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            View Report
          </button>
          <a
            href={exportUrl}
            download
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors inline-block"
          >
            Download
          </a>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
