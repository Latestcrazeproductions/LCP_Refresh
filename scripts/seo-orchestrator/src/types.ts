export type Track = 'A' | 'B';
export type Layer = 'national' | 'geo';
export type Cadence = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'research' | 'phase';

export type DailyCategory = 'captureBlog' | 'service' | 'strategyBlog' | 'authority' | 'geo';

export const DAILY_CATEGORY_ORDER: DailyCategory[] = [
  'captureBlog',
  'service',
  'strategyBlog',
  'authority',
  'geo',
];

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
  /** Cycles Mon→Fri categories when cadence=daily (0=captureBlog … 4=geo). */
  categoryDayIndex?: number;
  /** Rotates authority task variants on authority days. */
  authorityRotationIndex?: number;
  lastAdvancedAt: string | null;
}

export interface Task {
  id: string;
  type: string;
  agent: string;
  track: Track;
  targetKey: string;
  url?: string;
  siteId?: string;
  briefPath?: string;
  description: string;
}

export type ReservationStatus = 'in_review' | 'completed' | 'failed';

export interface TaskReservation {
  taskId: string;
  type: string;
  targetKey: string;
  status: ReservationStatus;
  cadence: Cadence;
  dispatchedAt: string;
  runId?: string;
  agentId?: string;
  error?: string;
}

export interface ReservationLedger {
  version: 1;
  reservations: TaskReservation[];
}

export interface ContentTopic {
  slug: string;
  title: string;
  track: Track;
  status: 'queued' | 'published';
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
  'hub.markets_create': 'NationalContentAgent',
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
  '/services/audio',
  '/services/lighting',
  '/services/stage',
  '/services/projection',
];
