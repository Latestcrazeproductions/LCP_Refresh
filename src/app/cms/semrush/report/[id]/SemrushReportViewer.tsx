'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { semrushApi, type ReportData } from '@/lib/semrush-api';
import MetricsChart from '@/components/semrush/MetricsChart';
import DataTable from '@/components/semrush/DataTable';

interface Props {
  reportId: string;
}

export default function SemrushReportViewer({ reportId }: Props) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport(reportId);
  }, [reportId]);

  const loadReport = async (id: string) => {
    try {
      setLoading(true);
      const data = await semrushApi.getReport(id);
      setReport(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'keywords', label: 'Keywords' },
    { id: 'backlinks', label: 'Backlinks' },
    { id: 'competitors', label: 'Competitors' },
    { id: 'traffic', label: 'Traffic' },
    { id: 'content', label: 'Content' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Report not found'}</p>
          <Link
            href="/cms/semrush"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { sections } = report;
  const overview = sections.overview || {};
  const keywords = sections.keywords || {};
  const backlinks = sections.backlinks || {};
  const competitors = sections.competitors || {};
  const traffic = sections.traffic || {};
  const content = sections.content || {};

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/cms/semrush" className="text-gray-400 hover:text-white mb-4 inline-block">
            ← Back to Semrush
          </Link>
          <h1 className="text-4xl font-bold mb-2">Domain Analytics Report</h1>
          <p className="text-gray-400">
            {report.domain} • Generated: {new Date(report.generated_at).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Domain Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Rank</p>
                  <p className="text-2xl font-bold">{overview.rank?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Organic Keywords</p>
                  <p className="text-2xl font-bold">{overview.organic_keywords?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Organic Traffic</p>
                  <p className="text-2xl font-bold">{overview.organic_traffic?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Traffic Cost</p>
                  <p className="text-2xl font-bold">${overview.organic_cost?.toLocaleString() || '0'}</p>
                </div>
              </div>
              {traffic.history && Array.isArray(traffic.history) && traffic.history.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Traffic Trends</h3>
                  <MetricsChart
                    data={traffic.history as Record<string, unknown>[]}
                    xKey="date"
                    yKey="organic_traffic"
                    type="line"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Organic Keywords</h2>
                <p className="text-gray-400">Total: {keywords.total || 0} keywords</p>
              </div>
              {keywords.summary && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Avg Position</p>
                    <p className="text-xl font-bold">{keywords.summary.average_position || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Total Traffic</p>
                    <p className="text-xl font-bold">{keywords.summary.total_traffic?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Search Volume</p>
                    <p className="text-xl font-bold">{keywords.summary.total_search_volume?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
              )}
              {keywords.keywords && Array.isArray(keywords.keywords) && keywords.keywords.length > 0 ? (
                <DataTable
                  data={keywords.keywords as Record<string, unknown>[]}
                  columns={[
                    { key: 'keyword', label: 'Keyword' },
                    { key: 'position', label: 'Position' },
                    { key: 'search_volume', label: 'Volume' },
                    { key: 'cpc', label: 'CPC' },
                    { key: 'traffic', label: 'Traffic' },
                  ]}
                />
              ) : (
                <p className="text-gray-400">No keyword data available</p>
              )}
            </div>
          )}

          {activeTab === 'backlinks' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Backlinks Analysis</h2>
              {backlinks.overview && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Total Backlinks</p>
                    <p className="text-2xl font-bold">{backlinks.overview.total?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Referring Domains</p>
                    <p className="text-2xl font-bold">{backlinks.overview.domains?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Follow Links</p>
                    <p className="text-2xl font-bold">{backlinks.overview.follows?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">NoFollow Links</p>
                    <p className="text-2xl font-bold">{backlinks.overview.nofollows?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
              )}
              {backlinks.backlinks && Array.isArray(backlinks.backlinks) && backlinks.backlinks.length > 0 ? (
                <DataTable
                  data={(backlinks.backlinks as Record<string, unknown>[]).slice(0, 50)}
                  columns={[
                    { key: 'source_url', label: 'Source URL' },
                    { key: 'target_url', label: 'Target URL' },
                    { key: 'anchor', label: 'Anchor Text' },
                    { key: 'nofollow', label: 'Type' },
                  ]}
                />
              ) : (
                <p className="text-gray-400">No backlink data available</p>
              )}
            </div>
          )}

          {activeTab === 'competitors' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Competitor Analysis</h2>
              {competitors.competitors && Array.isArray(competitors.competitors) && competitors.competitors.length > 0 ? (
                <DataTable
                  data={competitors.competitors as Record<string, unknown>[]}
                  columns={[
                    { key: 'domain', label: 'Domain' },
                    { key: 'rank', label: 'Rank' },
                    { key: 'organic_keywords', label: 'Keywords' },
                    { key: 'organic_traffic', label: 'Traffic' },
                    { key: 'organic_cost', label: 'Cost' },
                  ]}
                />
              ) : (
                <p className="text-gray-400">No competitor data available</p>
              )}
            </div>
          )}

          {activeTab === 'traffic' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Traffic Trends</h2>
              {traffic.history && Array.isArray(traffic.history) && traffic.history.length > 0 ? (
                <MetricsChart
                  data={traffic.history as Record<string, unknown>[]}
                  xKey="date"
                  yKey="organic_traffic"
                  type="line"
                />
              ) : (
                <p className="text-gray-400">No traffic history available</p>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Top Pages</h2>
              {content.pages && Array.isArray(content.pages) && content.pages.length > 0 ? (
                <DataTable
                  data={content.pages as Record<string, unknown>[]}
                  columns={[
                    { key: 'url', label: 'URL' },
                    { key: 'traffic', label: 'Traffic' },
                    { key: 'keywords', label: 'Keywords' },
                    { key: 'backlinks', label: 'Backlinks' },
                  ]}
                />
              ) : (
                <p className="text-gray-400">No content data available</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <a
            href={semrushApi.getReportExportUrl(reportId)}
            download
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Export JSON
          </a>
          <Link
            href="/cms/semrush"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
