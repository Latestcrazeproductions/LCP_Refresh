export type Track = 'A' | 'B';
export type Layer = 'national' | 'geo';
export type Cadence = 'weekly' | 'monthly' | 'quarterly' | 'research' | 'phase';

export interface PageRecord {
  url: string;
  layer: Layer;
  type: string;
  keyword?: string;
  title?: string;
  track: Track;
  tier: string;
  phase: number;
  lastUpdated?: string | null;
  nextAction?: string;
  implementationStatus?: 'live' | 'planned';
  siteId?: string;
  pattern?: string;
}

export interface RegistryConfig {
  phase: number;
  allowNewGeoSites: boolean;
  flagshipDomain: string;
  nationwideHubUrl: string;
  researchStaleDays: number;
  maxTasksPerRun: number;
}

export interface RotationState {
  week: number;
  geoBatchA: string[];
  geoBatchB: string[];
  serviceRotationIndex: number;
  strategyBlogWeek: boolean;
  lastAdvancedAt: string | null;
}

export interface Task {
  id: string;
  type: string;
  agent: string;
  track: Track;
  url?: string;
  siteId?: string;
  briefPath?: string;
  description: string;
}

export interface QaIssue {
  rule: string;
  message: string;
  severity: 'error' | 'warn';
}

export interface QaReport {
  passed: boolean;
  issues: QaIssue[];
}

export const AGENT_MAP: Record<string, string> = {
  'research.keyword_gap_scan': 'ResearchAgent',
  'research.trending_topics': 'ResearchAgent',
  'research.competitor_audit': 'ResearchAgent',
  'research.topic_brief': 'ResearchAgent',
  'blog.national.create': 'NationalContentAgent',
  'authority.strategy_blog': 'NationalContentAgent',
  'hub.nationwide_refresh': 'NationalContentAgent',
  'seo.meta_experiment': 'NationalContentAgent',
  'blog.geo.create': 'GeoBatchAgent',
  'geo.local_proof': 'GeoBatchAgent',
  'geo.batch_deep_refresh': 'GeoBatchAgent',
  'service.gallery_swap': 'ServiceRefreshAgent',
  'service.faq_refresh': 'ServiceRefreshAgent',
  'service.date_touch': 'ServiceRefreshAgent',
  'conversion.landing_improve': 'ServiceRefreshAgent',
  'authority.case_study': 'AuthorityContentAgent',
  'authority.venue_guide': 'AuthorityContentAgent',
  'demand.tool_page': 'AuthorityContentAgent',
  'seo.internal_links': 'PlannerAgent',
  'conversion.cta_audit': 'PlannerAgent',
  'metrics.monthly_review': 'PlannerAgent',
  'qa.gate': 'QAAgent',
};

export const SERVICE_ROTATION = [
  '/services/led-walls',
  '/services/audio-systems',
  '/services/event-lighting',
  '/services/staging',
  '/services/projection-mapping',
];
