'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';

export default function Settings() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [domain, setDomain] = useState('latestcrazeproductions.com');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedKey = localStorage.getItem('semrush_api_key');
    const savedDomain = localStorage.getItem('semrush_domain');
    if (savedKey) setApiKey(savedKey);
    if (savedDomain) setDomain(savedDomain);
  }, []);

  const handleTestApi = async () => {
    if (!apiKey) {
      setTestResult('Please enter an API key');
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const result = await api.testApi(apiKey);
      setTestResult(result.success ? '✓ API connection successful!' : '✗ API connection failed');
    } catch (err: any) {
      setTestResult(`✗ Error: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('semrush_api_key', apiKey);
    localStorage.setItem('semrush_domain', domain);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold">Settings</h1>
        </header>

        <div className="space-y-6">
          {/* API Configuration */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">API Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Semrush API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter your Semrush API key"
                  />
                  <button
                    onClick={handleTestApi}
                    disabled={testing || !apiKey}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {testing ? 'Testing...' : 'Test'}
                  </button>
                </div>
                {testResult && (
                  <p className={`mt-2 text-sm ${testResult.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                    {testResult}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Get your API key from Semrush → Subscription Info → API Key
                </p>
              </div>
            </div>
          </div>

          {/* Domain Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Domain Settings</h2>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Default Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="latestcrazeproductions.com"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {saved ? '✓ Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
