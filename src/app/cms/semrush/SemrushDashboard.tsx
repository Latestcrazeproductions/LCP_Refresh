'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { semrushApi, type Report, type QuickMetrics } from '@/lib/semrush-api';
import ReportCard from '@/components/semrush/ReportCard';
import MetricCard from '@/components/semrush/MetricCard';

export default function SemrushDashboard() {
  const [domain, setDomain] = useState('latestcrazeproductions.com');
  const [apiKey, setApiKey] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [metrics, setMetrics] = useState<QuickMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendConnection();
    loadReports();
    loadMetrics();
    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('semrush_api_key') : null;
    if (savedKey) setApiKey(savedKey);
  }, []);

  const checkBackendConnection = async () => {
    try {
      await semrushApi.getStatus();
      setBackendConnected(true);
    } catch {
      setBackendConnected(false);
    }
  };

  const loadReports = async () => {
    try {
      const data = await semrushApi.listReports();
      setReports(data.reports);
    } catch (err: unknown) {
      console.error('Failed to load reports:', err);
      if (backendConnected !== false) {
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      }
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await semrushApi.getLatestMetrics();
      setMetrics(data);
    } catch {
      // No reports yet, that's okay
    }
  };

  const handleGenerateReport = async () => {
    if (!apiKey) {
      setError('Please enter your Semrush API key in Settings');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('semrush_api_key', apiKey);
      }
      const result = await semrushApi.generateReport(domain, apiKey);
      setTimeout(() => {
        loadReports();
        loadMetrics();
        window.location.href = `/cms/semrush/report/${result.report_id}`;
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      setGenerating(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Delete this report?')) return;
    try {
      await semrushApi.deleteReport(reportId);
      loadReports();
      if (reports.length === 1) setMetrics(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete report');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/cms" className="text-gray-400 hover:text-white text-sm transition-colors">
              ← Dashboard
            </Link>
            <h1 className="text-4xl font-bold">Semrush Analytics</h1>
          </div>
          <Link
            href="/cms/semrush/settings"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Settings
          </Link>
        </header>

        {backendConnected === false && (
          <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
            <p className="text-yellow-200 font-semibold mb-2">⚠️ Backend Not Connected</p>
            <p className="text-yellow-300 text-sm mb-2">
              Cannot connect to backend API. Make sure the backend server is running:
            </p>
            <code className="block bg-black/50 p-2 rounded text-xs mt-2">
              cd semrush-report && source venv/bin/activate && python run_backend.py
            </code>
            <p className="text-yellow-300 text-xs mt-2">
              Backend should be running on: <code className="bg-black/50 px-1 rounded">http://localhost:5001</code>
            </p>
          </div>
        )}

        {error && backendConnected !== false && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="latestcrazeproductions.com"
                disabled={backendConnected === false}
              />
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={generating || !apiKey || backendConnected === false}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {generating ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Generate New Report
                </>
              )}
            </button>
          </div>
          {!apiKey && (
            <p className="mt-2 text-sm text-yellow-400">
              ⚠️ Please configure your Semrush API key in Settings
            </p>
          )}
        </div>

        {metrics && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Domain Authority" value={metrics.domain_authority.toString()} />
              <MetricCard label="Rank" value={metrics.rank.toLocaleString()} />
              <MetricCard label="Traffic" value={metrics.traffic.toLocaleString()} />
              <MetricCard label="Backlinks" value={metrics.backlinks.toLocaleString()} />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Last updated: {new Date(metrics.generated_at).toLocaleString()}
            </p>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Reports</h2>
          {backendConnected === false ? (
            <div className="p-8 bg-gray-800 rounded-lg text-center text-gray-400">
              <p>Backend server is not running. Start it to view reports.</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 bg-gray-800 rounded-lg text-center text-gray-400">
              <p>No reports yet. Click &quot;Generate New Report&quot; to create your first report.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  exportUrl={semrushApi.getReportExportUrl(report.id)}
                  onView={() => (window.location.href = `/cms/semrush/report/${report.id}`)}
                  onDelete={() => handleDeleteReport(report.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
