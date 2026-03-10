/** API client for Semrush Report backend */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6000';

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
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return response.json();
    } catch (error: any) {
      // Handle network errors (backend not running, CORS, etc.)
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to backend API at ${this.baseUrl}. Make sure the backend server is running.`);
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return response.json();
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to backend API at ${this.baseUrl}. Make sure the backend server is running.`);
      }
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return response.json();
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to backend API at ${this.baseUrl}. Make sure the backend server is running.`);
      }
      throw error;
    }
  }

  // API Methods
  async getStatus() {
    return this.get<{ status: string; message: string }>('/api/status');
  }

  async testApi(apiKey: string) {
    return this.post<{ success: boolean; message: string }>('/api/test', { api_key: apiKey });
  }

  async generateReport(domain: string, apiKey: string) {
    return this.post<{ success: boolean; report_id: string; filename: string; generated_at: string }>(
      '/api/reports/generate',
      { domain, api_key: apiKey }
    );
  }

  async listReports() {
    return this.get<{ reports: Report[] }>('/api/reports');
  }

  async getReport(reportId: string) {
    return this.get<ReportData>(`/api/reports/${reportId}`);
  }

  async deleteReport(reportId: string) {
    return this.delete<{ success: boolean; message: string }>(`/api/reports/${reportId}`);
  }

  async getLatestMetrics() {
    return this.get<QuickMetrics>('/api/metrics/latest');
  }

  getReportExportUrl(reportId: string) {
    return `${this.baseUrl}/api/reports/${reportId}/export`;
  }
}

export const api = new ApiClient();
