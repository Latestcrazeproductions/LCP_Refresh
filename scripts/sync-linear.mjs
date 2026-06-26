/**
 * Sync build plan + repo markdown docs → Linear (team: LCP-calendar-look-ahead).
 *
 * - Project: full fields (summary, description, dates, priority, milestones)
 * - Issues: epics + deliverables from linear-build-plan.json
 * - Documents: every docs/*.md mirrored as a Linear project document (content replaced on change)
 *
 * Usage:
 *   LINEAR_API_KEY=lin_api_... npm run sync:linear
 *   npm run sync:linear -- --dry-run
 *   npm run sync:linear -- --docs-only
 *   npm run sync:linear -- --plan-only
 *
 * State: scripts/linear-sync-state.json (maps repo paths → Linear IDs + content hashes)
 */

import {
  readFileSync,
  readdirSync,
  writeFileSync,
  statSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PLAN_PATH = join(__dirname, 'linear-build-plan.json');
const STATE_PATH = join(__dirname, 'linear-sync-state.json');
const DOCS_DIR = join(ROOT, 'docs');
const API_URL = 'https://api.linear.app/graphql';

const ISSUE_MARKER = 'lcp-build-plan:';
const DOC_MARKER = 'lcp-doc-sync:';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const docsOnly = args.includes('--docs-only');
const planOnly = args.includes('--plan-only');

const plan = JSON.parse(readFileSync(PLAN_PATH, 'utf8'));
const state = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
const apiKey = process.env.LINEAR_API_KEY?.trim();
const teamKey = process.env.LINEAR_TEAM_KEY ?? plan.team?.key ?? state.teamKey ?? 'LCP-calendar-look-ahead';

if (!dryRun && !apiKey) {
  console.error(
    'Missing LINEAR_API_KEY.\n' +
      '  Linear → Settings → API → create key\n' +
      '  LINEAR_API_KEY=lin_api_... npm run sync:linear'
  );
  process.exit(1);
}

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

function saveState() {
  if (!dryRun) {
    state.lastSyncAt = new Date().toISOString();
    writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
  }
}

async function gql(query, variables = {}) {
  if (dryRun) return { dryRun: true };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(
      json.errors.map((e) => `${e.message}${e.extensions ? ` (${JSON.stringify(e.extensions)})` : ''}`).join('; ')
    );
  }
  return json.data;
}

const STATUS_TO_STATE = {
  todo: ['Todo', 'Backlog', 'Triage'],
  in_progress: ['In Progress', 'Started'],
  done: ['Done', 'Completed'],
  blocked: ['Blocked', 'Todo', 'Backlog'],
  canceled: ['Canceled', 'Cancelled'],
};

const PRIORITY = { blocked: 1, in_progress: 2, todo: 3, done: 4, canceled: 0 };

async function getTeam() {
  const data = await gql(`query { teams { nodes { id key name } } }`);
  const team = data.teams.nodes.find((t) => t.key === teamKey || t.name === teamKey);
  if (!team) throw new Error(`Team not found: ${teamKey}`);
  return team;
}

async function getTeamStates(teamId) {
  const data = await gql(
    `query($id: String!) { team(id: $id) { states { nodes { id name type } } } }`,
    { id: teamId }
  );
  return data.team.states.nodes;
}

function resolveStateId(states, status) {
  const names = STATUS_TO_STATE[status] ?? STATUS_TO_STATE.todo;
  for (const name of names) {
    const hit = states.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (hit) return hit.id;
  }
  return states.find((s) => s.type === 'backlog')?.id ?? states[0]?.id;
}

async function ensureLabel(teamId, name, color = '#95A2B3') {
  const data = await gql(
    `query($teamId: ID!, $name: String!) {
      issueLabels(filter: { team: { id: { eq: $teamId } }, name: { eq: $name } }) {
        nodes { id }
      }
    }`,
    { teamId, name }
  );
  if (data.issueLabels.nodes[0]) return data.issueLabels.nodes[0].id;

  const created = await gql(
    `mutation($input: IssueLabelCreateInput!) {
      issueLabelCreate(input: $input) { issueLabel { id } }
    }`,
    { input: { teamId, name, color } }
  );
  return created.issueLabelCreate.issueLabel.id;
}

async function findProject(name) {
  const data = await gql(`
    query {
      projects(first: 100) {
        nodes { id name url description state priority startDate targetDate }
      }
    }
  `);
  return data.projects.nodes.find((p) => p.name === name) ?? null;
}

async function upsertProject(teamId, def) {
  const existing = dryRun ? null : await findProject(def.name);
  const description = def.summary
    ? `${def.summary}\n\n${def.description}`
    : def.description;
  const input = {
    name: def.name,
    description,
    color: def.color,
    icon: def.icon,
    state: def.state ?? 'started',
    priority: def.priority ?? 2,
    startDate: def.startDate,
    startDateResolution: def.startDateResolution,
    targetDate: def.targetDate,
    targetDateResolution: def.targetDateResolution,
    teamIds: [teamId],
  };

  if (existing) {
    console.log(`Project exists: ${existing.name}`);
    state.projectId = existing.id;
    state.projectName = existing.name;
    return existing;
  }

  console.log(`Creating project: ${def.name}`);
  if (dryRun) return { id: 'dry-project', name: def.name, url: 'https://linear.app' };

  const data = await gql(
    `mutation($input: ProjectCreateInput!) {
      projectCreate(input: $input) {
        project { id name url }
      }
    }`,
    { input }
  );
  const project = data.projectCreate.project;
  state.projectId = project.id;
  state.projectName = project.name;
  return project;
}

async function upsertMilestone(projectId, epic) {
  const key = epic.key;
  const existingId = state.milestones[key];

  const input = {
    projectId,
    name: epic.title,
    description: epic.description,
    targetDate: epic.targetDate ?? null,
  };

  if (existingId && !dryRun) {
    const data = await gql(
      `mutation($id: String!, $input: ProjectMilestoneUpdateInput!) {
        projectMilestoneUpdate(id: $id, input: $input) {
          projectMilestone { id name }
        }
      }`,
      { id: existingId, input: { name: input.name, description: input.description, targetDate: input.targetDate } }
    );
    return data.projectMilestoneUpdate.projectMilestone;
  }

  if (dryRun) return { id: `dry-ms-${key}`, name: epic.title };

  const data = await gql(
    `mutation($input: ProjectMilestoneCreateInput!) {
      projectMilestoneCreate(input: $input) {
        projectMilestone { id name }
      }
    }`,
    { input }
  );
  const ms = data.projectMilestoneCreate.projectMilestone;
  state.milestones[key] = ms.id;
  return ms;
}

function issueMarker(epicKey, issueKey) {
  return `${ISSUE_MARKER}${epicKey}/${issueKey}`;
}

function buildIssueDescription(issue, epicKey, repoPath) {
  const parts = [];
  if (issue.description) parts.push(issue.description);
  if (issue.owner) parts.push(`**Owner:** ${issue.owner}`);
  if (issue.verify) parts.push(`**Verify:** ${issue.verify}`);
  if (issue.estimate) parts.push(`**Estimate:** ${issue.estimate} pts`);
  if (repoPath) parts.push(`**Repo:** \`${repoPath}\``);
  parts.push(`\n---\n${issueMarker(epicKey, issue.key)}`);
  return parts.join('\n\n');
}

async function findIssueByMarker(teamId, markerText) {
  const cached = Object.entries(state.issues).find(([, v]) => v.marker === markerText);
  if (cached?.[1]?.id && !dryRun) {
    const data = await gql(
      `query($id: String!) { issue(id: $id) { id identifier title } }`,
      { id: cached[1].id }
    );
    if (data.issue) return data.issue;
  }

  const data = await gql(
    `query($id: String!) {
      team(id: $id) {
        issues(first: 250, orderBy: updatedAt) {
          nodes { id identifier title description }
        }
      }
    }`,
    { id: teamId }
  );
  return data.team.issues.nodes.find((i) => i.description?.includes(markerText)) ?? null;
}

async function upsertIssue({
  teamId,
  teamKey: tk,
  projectId,
  projectName,
  states,
  milestoneId,
  parentId,
  epicKey,
  issue,
  labelIds,
  blockedBy,
}) {
  const m = issueMarker(epicKey, issue.key);
  const title = `[${issue.key}] ${issue.title}`;
  const description = buildIssueDescription(issue, epicKey, issue.repoPath);
  const stateId = resolveStateId(states, issue.status);
  const repoUrl = `https://github.com/latestcrazeproductions/LCP_Refresh/blob/main/${issue.docPath ?? 'docs/BUILD_PLAN.md'}`;

  const existing = dryRun ? null : await findIssueByMarker(teamId, m);

  const input = {
    teamId,
    title,
    description,
    projectId,
    parentId,
    stateId,
    priority: PRIORITY[issue.status] ?? 3,
    labelIds: labelIds.length ? labelIds : undefined,
    projectMilestoneId: milestoneId,
    estimate: issue.estimate ?? undefined,
  };

  let result;
  if (existing) {
    console.log(`  update ${existing.identifier ?? existing.id} — ${title}`);
    if (dryRun) {
      result = { id: `dry-${epicKey}-${issue.key}`, identifier: `DRY-${issue.key}` };
    } else {
      const data = await gql(
        `mutation($id: String!, $input: IssueUpdateInput!) {
          issueUpdate(id: $id, input: $input) {
            issue { id identifier url title }
          }
        }`,
        { id: existing.id, input }
      );
      result = data.issueUpdate.issue;
    }
  } else {
    console.log(`  create — ${title}`);
    if (dryRun) {
      result = { id: `dry-${epicKey}-${issue.key}`, identifier: `DRY-${issue.key}` };
    } else {
      const data = await gql(
        `mutation($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            issue { id identifier url title }
          }
        }`,
        { input }
      );
      result = data.issueCreate.issue;

      await gql(
        `mutation($input: AttachmentCreateInput!) {
          attachmentCreate(input: $input) { success }
        }`,
        {
          input: {
            issueId: result.id,
            title: 'Repo reference',
            url: repoUrl,
          },
        }
      ).catch(() => {});
    }
  }

  state.issues[`${epicKey}/${issue.key}`] = {
    id: result.id,
    identifier: result.identifier,
    marker: m,
    url: result.url,
  };

  return result;
}

function listMarkdownDocs() {
  return readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => join('docs', f))
    .sort();
}

function docFooter(repoPath) {
  return `\n\n---\n<!-- ${DOC_MARKER}${repoPath} -->\n*Synced from \`${repoPath}\` · run \`npm run sync:linear\` to refresh*`;
}

async function listProjectDocuments(projectId) {
  const data = await gql(
    `query($id: String!) {
      project(id: $id) {
        documents { nodes { id title content } }
      }
    }`,
    { id: projectId }
  );
  return data.project?.documents?.nodes ?? [];
}

async function upsertDocument(projectId, projectName, repoPath) {
  const absPath = join(ROOT, repoPath);
  const raw = readFileSync(absPath, 'utf8');
  const hash = sha256(raw);
  const prev = state.documents[repoPath];

  if (prev?.hash === hash && prev?.id) {
    console.log(`  skip (unchanged) — ${repoPath}`);
    return { action: 'skip', repoPath };
  }

  const title = repoPath;
  const content = raw + docFooter(repoPath);
  console.log(`  ${prev?.id ? 'update' : 'create'} — ${repoPath}`);

  if (dryRun) {
    state.documents[repoPath] = { id: prev?.id ?? `dry-doc-${repoPath}`, hash, title };
    return { action: prev?.id ? 'update' : 'create', repoPath };
  }

  if (prev?.id) {
    const data = await gql(
      `mutation($id: String!, $input: DocumentUpdateInput!) {
        documentUpdate(id: $id, input: $input) {
          document { id title url }
        }
      }`,
      { id: prev.id, input: { title, content } }
    );
    const doc = data.documentUpdate.document;
    state.documents[repoPath] = { id: doc.id, hash, title, url: doc.url };
    return { action: 'update', doc };
  }

  // Try match by marker in existing project docs
  const existingDocs = await listProjectDocuments(projectId);
  const hit = existingDocs.find((d) => d.content?.includes(`${DOC_MARKER}${repoPath}`) || d.title === title);

  if (hit) {
    const data = await gql(
      `mutation($id: String!, $input: DocumentUpdateInput!) {
        documentUpdate(id: $id, input: $input) {
          document { id title url }
        }
      }`,
      { id: hit.id, input: { title, content } }
    );
    const doc = data.documentUpdate.document;
    state.documents[repoPath] = { id: doc.id, hash, title, url: doc.url };
    return { action: 'update', doc };
  }

  const data = await gql(
    `mutation($input: DocumentCreateInput!) {
      documentCreate(input: $input) {
        document { id title url }
      }
    }`,
    { input: { title, content, projectId } }
  );
  const doc = data.documentCreate.document;
  state.documents[repoPath] = { id: doc.id, slug: doc.slug, hash, title, url: doc.url };
  return { action: 'create', doc };
}

async function syncPlan(team, project) {
  const states = dryRun
    ? [{ id: 's1', name: 'Todo' }, { id: 's2', name: 'In Progress' }, { id: 's3', name: 'Done' }]
    : await getTeamStates(team.id);

  const labelCache = {};
  const ownerColors = { engineering: '#5E6AD2', marketing: '#26B5CE', leadership: '#F2C94C', product: '#BB87FC' };
  async function label(name, color) {
    if (!labelCache[name]) labelCache[name] = dryRun ? name : await ensureLabel(team.id, name, color);
    return labelCache[name];
  }

  const epicIds = {};

  for (const epic of plan.epics) {
    console.log(`\nEpic: ${epic.title}`);
    const milestone = await upsertMilestone(project.id, epic);

    const epicLabels = [await label('seo-demand-engine', '#5E6AD2')];
    const epicIssue = await upsertIssue({
      teamId: team.id,
      teamKey: team.key,
      projectId: project.id,
      projectName: project.name,
      states,
      milestoneId: milestone.id,
      parentId: undefined,
      epicKey: epic.key,
      issue: {
        key: epic.key,
        title: epic.title,
        description: epic.description,
        status: epic.status,
        estimate: epic.estimate,
        docPath: epic.docPath,
      },
      labelIds: epicLabels,
    });
    epicIds[epic.key] = epicIssue.id;

    for (const issue of epic.issues) {
      const labels = issue.owner ? [await label(`owner:${issue.owner}`, ownerColors[issue.owner] ?? '#95A2B3')] : [];
      if (issue.status === 'blocked') labels.push(await label('blocked-phase-0', '#EB5757'));

      await upsertIssue({
        teamId: team.id,
        teamKey: team.key,
        projectId: project.id,
        projectName: project.name,
        states,
        milestoneId: milestone.id,
        parentId: epicIssue.id,
        epicKey: epic.key,
        issue,
        labelIds: labels,
        blockedBy: issue.status === 'blocked' ? ['phase-0'] : undefined,
      });
    }
  }
}

async function syncDocs(project) {
  const paths = listMarkdownDocs();
  console.log(`\nSyncing ${paths.length} markdown docs…`);
  const results = [];
  for (const repoPath of paths) {
    results.push(await upsertDocument(project.id, project.name, repoPath));
  }
  return results;
}

async function main() {
  console.log(dryRun ? 'DRY RUN\n' : 'Syncing to Linear…');
  console.log(`Team: ${teamKey}\n`);

  const team = dryRun ? { id: 'dry-team', key: teamKey, name: teamKey } : await getTeam();

  let project = { id: state.projectId ?? 'dry-project', name: plan.project.name, url: '' };
  if (!docsOnly) {
    project = await upsertProject(team.id, plan.project);
    console.log(`Project: ${project.name}${project.url ? ` (${project.url})` : ''}`);
  } else if (state.projectId) {
    project.id = state.projectId;
  } else if (!dryRun) {
    const found = await findProject(plan.project.name);
    if (!found) throw new Error('Project not found. Run full sync first (without --docs-only).');
    project = found;
  }

  if (!planOnly) {
    await syncDocs(project);
  }

  if (!docsOnly) {
    await syncPlan(team, project);
  }

  saveState();

  console.log('\nDone.');
  if (!dryRun) {
    console.log(`State saved: ${STATE_PATH}`);
    console.log('Re-run after editing docs/ or scripts/linear-build-plan.json');
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
