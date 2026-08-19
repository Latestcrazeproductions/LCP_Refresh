import type {
  Cadence,
  ContentTopic,
  PageRecord,
  RegistryConfig,
  RotationState,
  Task,
  Track,
} from './types.js';
import { AGENT_MAP, SERVICE_ROTATION } from './types.js';
import { isNationwideHubLive } from './registry.js';
import { needsToolPageBuild } from './tool-pages.js';

interface ScheduleInput {
  cadence: Cadence;
  config: RegistryConfig;
  rotation: RotationState;
  pages: PageRecord[];
  researchLastScanAt: string | null;
  maxTasks: number;
  nationalTopics?: ContentTopic[];
  strategyTopics?: ContentTopic[];
  blockedTargetKeys?: Set<string>;
}

function task(
  type: string,
  track: Track,
  description: string,
  targetKey: string,
  extra: Partial<Task> = {}
): Task {
  return {
    id: `${type}:${targetKey}`,
    type,
    agent: AGENT_MAP[type] ?? 'PlannerAgent',
    track,
    targetKey,
    description,
    ...extra,
  };
}

function queuedTopic(
  topics: ContentTopic[] = [],
  pages: PageRecord[],
  blocked: Set<string>
): ContentTopic | undefined {
  return topics.find(
    (topic) =>
      topic.status === 'queued' &&
      !blocked.has(topic.slug) &&
      !pages.some(
        (page) =>
          page.url === `/blog/${topic.slug}` && page.implementationStatus === 'live'
      )
  );
}

function oldestServicePage(pages: PageRecord[], filter?: (p: PageRecord) => boolean): PageRecord | undefined {
  const candidates = pages
    .filter((p) => p.type === 'service' && p.implementationStatus === 'live')
    .filter((p) => (filter ? filter(p) : true))
    .sort((a, b) => (a.lastUpdated ?? '').localeCompare(b.lastUpdated ?? ''));
  return candidates[0];
}

function scheduleDailyTasks(
  config: RegistryConfig,
  rotation: RotationState,
  pages: PageRecord[],
  nationalTopics: ContentTopic[] | undefined,
  strategyTopics: ContentTopic[] | undefined,
  blockedTargetKeys: Set<string>
): Task[] {
  const tasks: Task[] = [];
  const geoAllowed = config.allowNewGeoSites && isNationwideHubLive(pages, config.nationwideHubUrl);
  const nationalOnly = config.phase < 2 || !geoAllowed;
  const usedNationalSlugs = new Set(blockedTargetKeys);

  const captureTopic = queuedTopic(nationalTopics, pages, usedNationalSlugs);
  if (captureTopic) {
    tasks.push(
      task('blog.national.create', 'A', `Daily capture blog: ${captureTopic.title}`, captureTopic.slug, {
        url: `/blog/${captureTopic.slug}`,
      })
    );
    usedNationalSlugs.add(captureTopic.slug);
  }

  const serviceUrl =
    SERVICE_ROTATION[rotation.serviceRotationIndex % SERVICE_ROTATION.length] ??
    '/services/led-walls';
  if (rotation.serviceRotationIndex % 2 === 0) {
    tasks.push(
      task('service.gallery_swap', 'A', `Gallery swap on ${serviceUrl}`, serviceUrl, { url: serviceUrl })
    );
  } else {
    const faqTarget = oldestServicePage(pages, (p) => p.layer === 'national') ?? oldestServicePage(pages);
    if (faqTarget) {
      tasks.push(
        task('service.faq_refresh', 'A', `FAQ refresh on ${faqTarget.url}`, faqTarget.url, {
          url: faqTarget.url,
        })
      );
    } else {
      tasks.push(
        task('service.gallery_swap', 'A', `Gallery swap on ${serviceUrl}`, serviceUrl, { url: serviceUrl })
      );
    }
  }

  const strategyTopic = queuedTopic(strategyTopics, pages, blockedTargetKeys);
  if (strategyTopic) {
    tasks.push(
      task('authority.strategy_blog', 'B', `Daily strategy blog: ${strategyTopic.title}`, strategyTopic.slug, {
        url: `/blog/${strategyTopic.slug}`,
      })
    );
  }

  const authoritySlot = (rotation.authorityRotationIndex ?? 0) % 3;
  if (authoritySlot === 0) {
    tasks.push(
      task('authority.case_study', 'B', 'Daily case study draft or refresh', '/work/night-of-hope', {
        url: '/work/night-of-hope',
      })
    );
  } else if (authoritySlot === 1 && needsToolPageBuild(pages)) {
    tasks.push(
      task('demand.tool_page', 'B', 'Daily planning tool page', '/resources/event-production-checklist', {
        url: '/resources/event-production-checklist',
      })
    );
  } else if (authoritySlot === 2) {
    tasks.push(task('authority.venue_guide', 'B', 'Daily venue guide refresh', 'daily-venue-guide'));
  } else {
    tasks.push(
      task('authority.case_study', 'B', 'Daily case study draft or refresh', '/work/night-of-hope', {
        url: '/work/night-of-hope',
      })
    );
  }

  if (!nationalOnly && rotation.geoBatchA.length > 0) {
    const siteId = rotation.geoBatchA[rotation.serviceRotationIndex % rotation.geoBatchA.length];
    if (siteId) {
      tasks.push(
        task('blog.geo.create', 'A', `Daily geo blog for ${siteId}`, `${siteId}:blog`, { siteId })
      );
    }
  } else {
    const geoFallback = queuedTopic(nationalTopics, pages, usedNationalSlugs);
    if (geoFallback) {
      tasks.push(
        task('blog.national.create', 'A', `Geo-slot capture blog: ${geoFallback.title}`, geoFallback.slug, {
          url: `/blog/${geoFallback.slug}`,
        })
      );
    }
  }

  return tasks;
}

export function scheduleTasks(input: ScheduleInput): Task[] {
  const {
    cadence,
    config,
    rotation,
    pages,
    maxTasks,
    nationalTopics,
    strategyTopics,
    blockedTargetKeys = new Set<string>(),
  } = input;
  const tasks: Task[] = [];
  const geoAllowed = config.allowNewGeoSites && isNationwideHubLive(pages, config.nationwideHubUrl);
  const nationalOnly = config.phase < 2 || !geoAllowed;

  if (cadence === 'phase') {
    const phase = Number(process.env.SEO_PHASE ?? config.phase);
    if (phase === 1) {
      if (!isNationwideHubLive(pages, config.nationwideHubUrl)) {
        tasks.push(
          task('hub.nationwide_refresh', 'A', 'Build nationwide hub', config.nationwideHubUrl, {
            url: config.nationwideHubUrl,
          })
        );
      }
      if (!pages.some((page) => page.url === '/markets' && page.implementationStatus === 'live')) {
        tasks.push(task('hub.markets_create', 'A', 'Build markets index', '/markets', { url: '/markets' }));
      }
      const captureTopic = queuedTopic(nationalTopics, pages, blockedTargetKeys);
      if (captureTopic) {
        tasks.push(
          task(
            'blog.national.create',
            'A',
            `Phase 1 national capture blog: ${captureTopic.title}`,
            captureTopic.slug,
            { url: `/blog/${captureTopic.slug}` }
          )
        );
      }
      const strategyTopic = queuedTopic(strategyTopics, pages, blockedTargetKeys);
      if (strategyTopic) {
        tasks.push(
          task(
            'authority.strategy_blog',
            'B',
            `Phase 1 strategy blog: ${strategyTopic.title}`,
            strategyTopic.slug,
            { url: `/blog/${strategyTopic.slug}` }
          )
        );
      }
      if (!blockedTargetKeys.has('/work/heard-museum')) {
        tasks.push(
          task('authority.case_study', 'B', 'Draft Heard Museum case study for approval', '/work/heard-museum', {
            url: '/work/heard-museum',
          })
        );
      }
      if (needsToolPageBuild(pages)) {
        tasks.push(
          task('demand.tool_page', 'B', 'Phase 1 planning resource', '/resources/event-production-checklist', {
          url: '/resources/event-production-checklist',
        })
        );
      }
    } else if (phase >= 2 && geoAllowed) {
      const batch = rotation.geoBatchA.slice(0, 2);
      for (const siteId of batch) {
        tasks.push(
          task('blog.geo.create', 'A', `Phase ${phase} geo blog for ${siteId}`, `${siteId}:blog`, { siteId }),
          task('geo.local_proof', 'A', `Phase ${phase} local proof for ${siteId}`, `${siteId}:proof`, { siteId })
        );
      }
    }
    return tasks.slice(0, maxTasks);
  }

  if (cadence === 'research') {
    tasks.push(
      task('research.keyword_gap_scan', 'A', 'Scan keyword gaps vs GSC snapshot and matrix', 'keyword-gap'),
      task('research.competitor_audit', 'B', 'Update competitor-scan.json from priority keywords', 'competitor-audit')
    );
    return tasks.slice(0, maxTasks);
  }

  if (cadence === 'monthly') {
    tasks.push(
      task('research.keyword_gap_scan', 'A', 'Monthly gap scan before content assignment', 'monthly-keyword-gap'),
      task('research.trending_topics', 'B', 'Refresh trending topics from sales intel + GSC', 'monthly-trends')
    );
    const faqTarget = oldestServicePage(pages, (p) => p.layer === 'national');
    if (faqTarget) {
      tasks.push(
        task('service.faq_refresh', 'A', `FAQ refresh on ${faqTarget.url}`, faqTarget.url, { url: faqTarget.url })
      );
    }
    tasks.push(
      task('conversion.cta_audit', 'B', 'Monthly CTA audit across live pages', 'monthly-cta'),
      task('metrics.monthly_review', 'B', 'Funnel gap report from metrics.json', 'monthly-metrics'),
      task('authority.case_study', 'B', 'Publish or refresh one case study', '/work/night-of-hope', {
        url: '/work/night-of-hope',
      }),
      task('conversion.landing_improve', 'B', 'Improve hero CTA on lowest-converting landing', 'lowest-converting-landing')
    );
    return tasks.slice(0, maxTasks);
  }

  if (cadence === 'quarterly') {
    tasks.push(
      task('research.competitor_audit', 'B', 'Quarterly competitor SERP audit', 'quarterly-competitor-audit'),
      task('library.spec_sync', 'A', 'Propagate spec library to geo wrappers', 'quarterly-spec-sync'),
      task('geo.batch_deep_refresh', 'A', 'Deep refresh geo batch (10 sites)', rotation.geoBatchA[0] ?? 'geo-batch-a', {
        siteId: rotation.geoBatchA[0],
      }),
      task('hub.nationwide_refresh', 'A', 'Refresh nationwide hub', config.nationwideHubUrl, {
        url: config.nationwideHubUrl,
      }),
      task('demand.tool_page', 'B', 'Refresh planning tool page', '/resources/event-production-checklist', {
        url: '/resources/event-production-checklist',
      }),
      task('authority.venue_guide', 'B', 'Refresh venue guide content', 'quarterly-venue-guide')
    );
    return tasks.slice(0, maxTasks);
  }

  if (cadence === 'daily') {
    return scheduleDailyTasks(
      config,
      rotation,
      pages,
      nationalTopics,
      strategyTopics,
      blockedTargetKeys
    ).slice(0, maxTasks);
  }

  // weekly (legacy — prefer daily cadence)
  const week = rotation.week;
  const serviceUrl =
    SERVICE_ROTATION[rotation.serviceRotationIndex % SERVICE_ROTATION.length] ??
    '/services/led-walls';

  if (week === 1) {
    if (rotation.strategyBlogWeek) {
      const topic = queuedTopic(strategyTopics, pages, blockedTargetKeys);
      if (topic) {
        tasks.push(
          task('authority.strategy_blog', 'B', `Executive strategy blog: ${topic.title}`, topic.slug, {
            url: `/blog/${topic.slug}`,
          })
        );
      }
    } else {
      const topic = queuedTopic(nationalTopics, pages, blockedTargetKeys);
      if (topic) {
        tasks.push(
          task('blog.national.create', 'A', `National capture blog: ${topic.title}`, topic.slug, {
            url: `/blog/${topic.slug}`,
          })
        );
      }
    }
    tasks.push(
      task('service.gallery_swap', 'A', `Gallery swap on ${serviceUrl}`, serviceUrl, { url: serviceUrl })
    );
    if (isNationwideHubLive(pages, config.nationwideHubUrl)) {
      tasks.push(
        task('service.date_touch', 'A', 'Touch nationwide hub date', config.nationwideHubUrl, {
          url: config.nationwideHubUrl,
        })
      );
    }
  } else if (week === 2) {
    if (!nationalOnly) {
      for (const siteId of rotation.geoBatchA.slice(0, 2)) {
        tasks.push(
          task('blog.geo.create', 'A', `Local blog for ${siteId}`, `${siteId}:blog`, { siteId }),
          task('geo.local_proof', 'A', `Local proof line for ${siteId}`, `${siteId}:proof`, { siteId })
        );
      }
    } else {
      const topic = queuedTopic(nationalTopics, pages, blockedTargetKeys);
      if (topic) {
        tasks.push(
          task('blog.national.create', 'A', `National blog: ${topic.title}`, topic.slug, {
            url: `/blog/${topic.slug}`,
          })
        );
      }
    }
    tasks.push(
      task('service.faq_refresh', 'A', 'Service FAQ refresh', '/services/audio', { url: '/services/audio' })
    );
  } else if (week === 3) {
    const topic = queuedTopic(nationalTopics, pages, blockedTargetKeys);
    if (topic) {
      tasks.push(
        task('blog.national.create', 'A', `National planning/capture blog: ${topic.title}`, topic.slug, {
          url: `/blog/${topic.slug}`,
        })
      );
    }
    tasks.push(
      task('seo.meta_experiment', 'A', 'GSC title candidate page refresh', 'gsc-title-candidate'),
      task('authority.case_study', 'B', 'Case study draft or refresh', '/work/night-of-hope', { url: '/work/night-of-hope' })
    );
  } else {
    if (!nationalOnly) {
      for (const siteId of rotation.geoBatchB.slice(0, 2)) {
        tasks.push(task('blog.geo.create', 'A', `Local blog for ${siteId}`, `${siteId}:blog`, { siteId }));
      }
      tasks.push(task('geo.local_proof', 'A', 'Geo FAQ refresh', `${rotation.geoBatchB[0]}:faq`, { siteId: rotation.geoBatchB[0] }));
    } else {
      const topic = queuedTopic(strategyTopics, pages, blockedTargetKeys);
      if (topic) {
        tasks.push(
          task('authority.strategy_blog', 'B', `Strategy blog: ${topic.title}`, topic.slug, {
            url: `/blog/${topic.slug}`,
          })
        );
      }
    }
    tasks.push(
      task('service.gallery_swap', 'A', 'Projection service gallery swap', '/services/projection', {
        url: '/services/projection',
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
