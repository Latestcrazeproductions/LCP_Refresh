import type { Cadence, PageRecord, RegistryConfig, RotationState, Task, Track } from './types.js';
import { AGENT_MAP, SERVICE_ROTATION } from './types.js';
import { isNationwideHubLive } from './registry.js';

interface ScheduleInput {
  cadence: Cadence;
  config: RegistryConfig;
  rotation: RotationState;
  pages: PageRecord[];
  researchLastScanAt: string | null;
  maxTasks: number;
}

function task(
  type: string,
  track: Track,
  description: string,
  extra: Partial<Task> = {}
): Task {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    agent: AGENT_MAP[type] ?? 'PlannerAgent',
    track,
    description,
    ...extra,
  };
}

function oldestServicePage(pages: PageRecord[], filter?: (p: PageRecord) => boolean): PageRecord | undefined {
  const candidates = pages
    .filter((p) => p.type === 'service' && p.implementationStatus === 'live')
    .filter((p) => (filter ? filter(p) : true))
    .sort((a, b) => (a.lastUpdated ?? '').localeCompare(b.lastUpdated ?? ''));
  return candidates[0];
}

export function scheduleTasks(input: ScheduleInput): Task[] {
  const { cadence, config, rotation, pages, maxTasks } = input;
  const tasks: Task[] = [];
  const geoAllowed = config.allowNewGeoSites && isNationwideHubLive(pages, config.nationwideHubUrl);
  const nationalOnly = config.phase < 2 || !geoAllowed;

  if (cadence === 'phase') {
    const phase = Number(process.env.SEO_PHASE ?? config.phase);
    if (phase === 1) {
      tasks.push(
        task('hub.nationwide_refresh', 'A', 'Build nationwide hub', { url: config.nationwideHubUrl }),
        task('blog.national.create', 'A', 'Phase 1 national capture blog'),
        task('authority.case_study', 'B', 'Phase 1 case study', { url: '/work/night-of-hope' }),
        task('authority.strategy_blog', 'B', 'Phase 1 strategy blog'),
        task('demand.tool_page', 'B', 'Phase 1 planning resource', {
          url: '/resources/event-production-checklist',
        })
      );
    } else if (phase >= 2 && geoAllowed) {
      const batch = rotation.geoBatchA.slice(0, 2);
      for (const siteId of batch) {
        tasks.push(
          task('blog.geo.create', 'A', `Phase ${phase} geo blog for ${siteId}`, { siteId }),
          task('geo.local_proof', 'A', `Phase ${phase} local proof for ${siteId}`, { siteId })
        );
      }
    }
    return tasks.slice(0, maxTasks);
  }

  if (cadence === 'research') {
    tasks.push(
      task('research.keyword_gap_scan', 'A', 'Scan keyword gaps vs GSC snapshot and matrix'),
      task('research.competitor_audit', 'B', 'Update competitor-scan.json from priority keywords')
    );
    return tasks.slice(0, maxTasks);
  }

  if (cadence === 'monthly') {
    tasks.push(
      task('research.keyword_gap_scan', 'A', 'Monthly gap scan before content assignment'),
      task('research.trending_topics', 'B', 'Refresh trending topics from sales intel + GSC')
    );
    const faqTarget = oldestServicePage(pages, (p) => p.layer === 'national');
    if (faqTarget) {
      tasks.push(
        task('service.faq_refresh', 'A', `FAQ refresh on ${faqTarget.url}`, { url: faqTarget.url })
      );
    }
    tasks.push(
      task('conversion.cta_audit', 'B', 'Monthly CTA audit across live pages'),
      task('metrics.monthly_review', 'B', 'Funnel gap report from metrics.json'),
      task('authority.case_study', 'B', 'Publish or refresh one case study', {
        url: '/work/night-of-hope',
      }),
      task('conversion.landing_improve', 'B', 'Improve hero CTA on lowest-converting landing')
    );
    return tasks.slice(0, maxTasks);
  }

  if (cadence === 'quarterly') {
    tasks.push(
      task('research.competitor_audit', 'B', 'Quarterly competitor SERP audit'),
      task('library.spec_sync', 'A', 'Propagate spec library to geo wrappers'),
      task('geo.batch_deep_refresh', 'A', 'Deep refresh geo batch (10 sites)', {
        siteId: rotation.geoBatchA[0],
      }),
      task('hub.nationwide_refresh', 'A', 'Refresh nationwide hub', {
        url: config.nationwideHubUrl,
      }),
      task('demand.tool_page', 'B', 'Refresh planning tool page', {
        url: '/resources/event-production-checklist',
      }),
      task('authority.venue_guide', 'B', 'Refresh venue guide content')
    );
    return tasks.slice(0, maxTasks);
  }

  // weekly (default)
  const week = rotation.week;
  const serviceUrl =
    SERVICE_ROTATION[rotation.serviceRotationIndex % SERVICE_ROTATION.length] ??
    '/services/led-walls';

  if (week === 1) {
    if (rotation.strategyBlogWeek) {
      tasks.push(
        task('authority.strategy_blog', 'B', 'Executive strategy blog from strategy-blog-topics.json')
      );
    } else {
      tasks.push(task('blog.national.create', 'A', 'National capture blog from national-blog-topics.json'));
    }
    tasks.push(
      task('service.gallery_swap', 'A', `Gallery swap on ${serviceUrl}`, { url: serviceUrl }),
      task('service.date_touch', 'A', 'Touch nationwide hub date', { url: config.nationwideHubUrl })
    );
  } else if (week === 2) {
    if (!nationalOnly) {
      for (const siteId of rotation.geoBatchA.slice(0, 2)) {
        tasks.push(
          task('blog.geo.create', 'A', `Local blog for ${siteId}`, { siteId }),
          task('geo.local_proof', 'A', `Local proof line for ${siteId}`, { siteId })
        );
      }
    } else {
      tasks.push(task('blog.national.create', 'A', 'National blog (geo locked until hub live)'));
    }
    tasks.push(
      task('service.faq_refresh', 'A', 'Service FAQ refresh', { url: '/services/audio-systems' })
    );
  } else if (week === 3) {
    tasks.push(
      task('blog.national.create', 'A', 'National planning/capture blog'),
      task('seo.meta_experiment', 'A', 'GSC title candidate page refresh'),
      task('authority.case_study', 'B', 'Case study draft or refresh', { url: '/work/night-of-hope' })
    );
  } else {
    if (!nationalOnly) {
      for (const siteId of rotation.geoBatchB.slice(0, 2)) {
        tasks.push(task('blog.geo.create', 'A', `Local blog for ${siteId}`, { siteId }));
      }
      tasks.push(task('geo.local_proof', 'A', 'Geo FAQ refresh', { siteId: rotation.geoBatchB[0] }));
    } else {
      tasks.push(task('authority.strategy_blog', 'B', 'Strategy blog while geo locked'));
    }
    tasks.push(
      task('service.gallery_swap', 'A', 'Projection service gallery swap', {
        url: '/services/projection-mapping',
      })
    );
  }

  return tasks.slice(0, maxTasks);
}

export function contentMixSummary(tasks: Task[]): Record<string, number> {
  const counts = { service: 0, captureBlog: 0, strategyBlog: 0, authority: 0 };
  for (const t of tasks) {
    if (t.type.startsWith('service.') || t.type.startsWith('geo.') || t.type.startsWith('library.'))
      counts.service++;
    else if (t.type === 'blog.national.create' || t.type === 'blog.geo.create') counts.captureBlog++;
    else if (t.type === 'authority.strategy_blog') counts.strategyBlog++;
    else if (t.type.startsWith('authority.') || t.type.startsWith('demand.')) counts.authority++;
  }
  return counts;
}
