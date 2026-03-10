/** API client for Semrush Report backend - uses same-origin proxy to avoid CORS */
const API_BASE_URL = '/api/semrush';

export interface Report {
  id: string;
  filename: string;
  domain: string;
  generated_at: string;
  size: number;
  modified: string;
}

export interface ReportData {
  domain: string;
  generated_at: string;
  sections: {
    overview?: any;
    keywords?: any;
    backlinks?: any;
    competitors?: any;
    traffic?: any;
    content?: any;
  };
}

export interface QuickMetrics {
  domain_authority: number;
  rank: number;
  traffic: number;
  backlinks: number;
  keywords: number;
  generated_at: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return response.json();
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string };
      if (err.name === 'TypeError' || (err.message && err.message.includes('Failed to fetch'))) {
        throw new Error(`Cannot connect to backend API. Make sure the backend server is running (see semrush-report/README.md).`);
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return response.json();
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string };
      if (err.name === 'TypeError' || (err.message && err.message.includes('Failed to fetch'))) {
        throw new Error(`Cannot connect to backend API. Make sure the backend server is running (see semrush-report/README.md).`);
      }
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, { method: 'DELETE' });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return response.json();
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string };
      if (err.name === 'TypeError' || (err.message && err.message.includes('Failed to fetch'))) {
        throw new Error(`Cannot connect to backend API. Make sure the backend server is running (see semrush-report/README.md).`);
      }
      throw error;
    }
  }

  async getStatus() {
    return this.get<{ status: string; message: string }>('/api/status');
  }

  async testApi(apiKey: string) {
    return this.post<{ success: boolean; message: string }>('/api/test', {
      api_key: apiKey,
    });
  }

  async generateReport(domain: string, apiKey: string) {
    return this.post<{
      success: boolean;
      report_id: string;
      filename: string;
      generated_at: string;
    }>('/api/reports/generate', { domain, api_key: apiKey });
  }

  async listReports() {
    return this.get<{ reports: Report[] }>('/api/reports');
  }

  async getReport(reportId: string) {
    return this.get<ReportData>(`/api/reports/${reportId}`);
  }

  async deleteReport(reportId: string) {
    return this.delete<{ success: boolean; message: string }>(
      `/api/reports/${reportId}`
    );
  }

  async getLatestMetrics() {
    return this.get<QuickMetrics>('/api/metrics/latest');
  }

  getReportExportUrl(reportId: string) {
    return `${this.baseUrl}/api/reports/${reportId}/export`;
  }
}

export const semrushApi = new ApiClient();
