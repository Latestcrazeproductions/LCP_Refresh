'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api, Report, QuickMetrics } from '../lib/api';
import ReportCard from '../components/ReportCard';
import MetricCard from '../components/MetricCard';

export default function Dashboard() {
  const router = useRouter();
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
    // Load API key from localStorage if available
    const savedKey = localStorage.getItem('semrush_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const checkBackendConnection = async () => {
    try {
      await api.getStatus();
      setBackendConnected(true);
    } catch (err) {
      setBackendConnected(false);
    }
  };

  const loadReports = async () => {
    try {
      const data = await api.listReports();
      setReports(data.reports);
    } catch (err: any) {
      console.error('Failed to load reports:', err);
      // Don't show error if backend isn't connected - that's handled separately
      if (backendConnected !== false) {
        setError(err.message);
      }
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await api.getLatestMetrics();
      setMetrics(data);
    } catch (err: any) {
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
      // Save API key to localStorage
      localStorage.setItem('semrush_api_key', apiKey);

      const result = await api.generateReport(domain, apiKey);
      
      // Wait a moment then reload reports
      setTimeout(() => {
        loadReports();
        loadMetrics();
        router.push(`/report/${result.report_id}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to generate report');
      setGenerating(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Delete this report?')) return;

    try {
      await api.deleteReport(reportId);
      loadReports();
      if (reports.length === 1) {
        setMetrics(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete report');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold">Semrush Analytics Dashboard</h1>
          <button
            onClick={() => router.push('/settings')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Settings
          </button>
        </header>

        {/* Backend Connection Warning */}
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
              Backend should be running on: <code className="bg-black/50 px-1 rounded">http://localhost:6000</code>
            </p>
          </div>
        )}

        {error && backendConnected !== false && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Domain Selector and Generate Button */}
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

        {/* Quick Stats */}
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

        {/* Recent Reports */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Reports</h2>
          {backendConnected === false ? (
            <div className="p-8 bg-gray-800 rounded-lg text-center text-gray-400">
              <p>Backend server is not running. Start it to view reports.</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 bg-gray-800 rounded-lg text-center text-gray-400">
              <p>No reports yet. Click "Generate New Report" to create your first report.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={() => router.push(`/report/${report.id}`)}
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
