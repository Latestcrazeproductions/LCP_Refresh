/**
 * Sync scripts/linear-build-plan.json → Linear project + issues.
 *
 * Linear is the execution source of truth for status. This JSON defines structure;
 * edit it when milestones/deliverables change, then re-run sync.
 *
 * Auth (pick one):
 *   LINEAR_API_KEY=lin_api_...     Personal/API key from Linear Settings → API
 *   (or authenticate Linear MCP in Cursor and run via agent)
 *
 * Usage:
 *   node scripts/sync-build-plan-to-linear.mjs [--dry-run] [--team LCP]
 *
 * Env:
 *   LINEAR_API_KEY   Required unless --dry-run
 *   LINEAR_TEAM_KEY  Team key override (default: first team, or --team flag)
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLAN_PATH = join(__dirname, 'linear-build-plan.json');
const API_URL = 'https://api.linear.app/graphql';
const MARKER_PREFIX = 'lcp-build-plan:';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const teamFlagIdx = args.indexOf('--team');
const teamKeyArg = teamFlagIdx >= 0 ? args[teamFlagIdx + 1] : undefined;

const plan = JSON.parse(readFileSync(PLAN_PATH, 'utf8'));
const apiKey = process.env.LINEAR_API_KEY?.trim();

if (!dryRun && !apiKey) {
  console.error(
    'Missing LINEAR_API_KEY. Create one at Linear → Settings → API, then:\n' +
      '  LINEAR_API_KEY=lin_api_... npm run sync:linear-build-plan\n\n' +
      'Or enable Linear MCP in Cursor (Settings → MCP) and ask the agent to sync after auth.'
  );
  process.exit(1);
}

async function gql(query, variables = {}) {
  if (dryRun) return { dryRun: true, query, variables };

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
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json.data;
}

function marker(key) {
  return `${MARKER_PREFIX}${key}`;
}

function issueTitle(key, title) {
  return `[${key}] ${title}`;
}

function buildDescription(issue, epicKey) {
  const owner = issue.owner ? `**Owner:** ${issue.owner}` : '';
  const footer = `\n\n---\n${marker(`${epicKey}/${issue.key}`)}`;
  return [issue.description, owner].filter(Boolean).join('\n\n') + footer;
}

const STATUS_TO_STATE = {
  todo: ['Todo', 'Backlog', 'Triage'],
  in_progress: ['In Progress', 'Started'],
  done: ['Done', 'Completed'],
  blocked: ['Blocked', 'Todo', 'Backlog'],
  canceled: ['Canceled', 'Cancelled'],
};

async function getTeams() {
  const data = await gql(`
    query Teams {
      teams { nodes { id key name } }
    }
  `);
  return data.teams.nodes;
}

async function getTeamWorkflowStates(teamId) {
  const data = await gql(`
    query TeamStates($teamId: String!) {
      team(id: $teamId) {
        states { nodes { id name type } }
      }
    }
  `, { teamId });
  return data.team.states.nodes;
}

function resolveStateId(states, status) {
  const candidates = STATUS_TO_STATE[status] ?? STATUS_TO_STATE.todo;
  for (const name of candidates) {
    const hit = states.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (hit) return hit.id;
  }
  const fallback = states.find((s) => s.type === 'backlog') ?? states[0];
  return fallback?.id;
}

async function findProjectByName(name) {
  const data = await gql(`
    query Projects {
      projects(first: 100) {
        nodes { id name url }
      }
    }
  `);
  return data.projects.nodes.find((p) => p.name === name) ?? null;
}

async function createProject(projectDef, teamId) {
  console.log(`Creating project: ${projectDef.name}`);
  if (dryRun) return { id: 'dry-project', name: projectDef.name, url: 'https://linear.app/project/dry-run' };
  const data = await gql(
    `mutation ProjectCreate($input: ProjectCreateInput!) {
      projectCreate(input: $input) {
        success
        project { id name url }
      }
    }`,
    {
      input: {
        name: projectDef.name,
        description: projectDef.description,
        color: projectDef.color,
        icon: projectDef.icon,
        teamIds: [teamId],
      },
    }
  );
  return data.projectCreate.project;
}

async function searchIssueByMarker(teamId, markerText) {
  const data = await gql(
    `query SearchIssues($term: String!, $teamId: ID!) {
      issueSearch(query: $term, filter: { team: { id: { eq: $teamId } } }, first: 5) {
        nodes { id identifier title url state { name } }
      }
    }`,
    { term: markerText, teamId }
  );
  return data.issueSearch.nodes.find((n) => n.title || true) ?? null;
}

async function findIssueByMarker(teamId, markerText) {
  const hit = await searchIssueByMarker(teamId, markerText);
  if (hit) return hit;

  // Fallback: list recent team issues and scan descriptions (search can lag)
  const data = await gql(
    `query TeamIssues($teamId: String!) {
      team(id: $teamId) {
        issues(first: 250, orderBy: updatedAt) {
          nodes { id identifier title url description state { name } }
        }
      }
    }`,
    { teamId }
  );
  return (
    data.team.issues.nodes.find((i) => i.description?.includes(markerText)) ?? null
  );
}

async function upsertIssue({
  teamId,
  projectId,
  stateId,
  parentId,
  epicKey,
  issue,
  labelIds,
}) {
  const m = marker(`${epicKey}/${issue.key}`);
  const title = issueTitle(issue.key, issue.title);
  const description = buildDescription(issue, epicKey);
  const existing = dryRun ? null : await findIssueByMarker(teamId, m);

  const input = {
    teamId,
    title,
    description,
    projectId,
    parentId,
    stateId,
    labelIds: labelIds.length ? labelIds : undefined,
    priority: issue.status === 'blocked' ? 1 : issue.status === 'done' ? 4 : 3,
  };

  if (existing) {
    console.log(`  update ${existing.identifier} — ${title}`);
    if (dryRun) return { action: 'update', title, marker: m, issue: { id: `dry-${epicKey}-${issue.key}` } };
    const data = await gql(
      `mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) {
          success
          issue { id identifier url title state { name } }
        }
      }`,
      { id: existing.id, input }
    );
    return { action: 'update', issue: data.issueUpdate.issue };
  }

  console.log(`  create — ${title}`);
  if (dryRun) return { action: 'create', title, marker: m, issue: { id: `dry-${epicKey}-${issue.key}` } };
  const data = await gql(
    `mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { id identifier url title state { name } }
      }
    }`,
    { input }
  );
  return { action: 'create', issue: data.issueCreate.issue };
}

async function ensureLabel(teamId, name, color = '#95A2B3') {
  if (dryRun) return `dry-label-${name}`;
  const data = await gql(
    `query Labels($teamId: ID!, $name: String!) {
      issueLabels(filter: { team: { id: { eq: $teamId } }, name: { eq: $name } }) {
        nodes { id name }
      }
    }`,
    { teamId, name }
  );
  if (data.issueLabels.nodes[0]) return data.issueLabels.nodes[0].id;

  console.log(`Creating label: ${name}`);
  const created = await gql(
    `mutation LabelCreate($input: IssueLabelCreateInput!) {
      issueLabelCreate(input: $input) {
        success
        issueLabel { id name }
      }
    }`,
    { input: { teamId, name, color } }
  );
  return created.issueLabelCreate.issueLabel.id;
}

async function main() {
  console.log(dryRun ? 'DRY RUN — no Linear writes\n' : 'Syncing build plan to Linear…\n');

  const teams = dryRun ? [{ id: 'dry-team', key: teamKeyArg ?? 'TEAM', name: 'Dry Run Team' }] : await getTeams();
  if (!teams.length) throw new Error('No Linear teams found');

  const team =
    teams.find((t) => t.key === (teamKeyArg ?? process.env.LINEAR_TEAM_KEY)) ?? teams[0];
  console.log(`Team: ${team.name} (${team.key})\n`);

  const states = dryRun
    ? [
        { id: 's-todo', name: 'Todo', type: 'unstarted' },
        { id: 's-progress', name: 'In Progress', type: 'started' },
        { id: 's-done', name: 'Done', type: 'completed' },
      ]
    : await getTeamWorkflowStates(team.id);

  let project = dryRun ? null : await findProjectByName(plan.project.name);
  if (!project) {
    project = await createProject(plan.project, team.id);
  } else {
    console.log(`Project exists: ${project.name} (${project.url})\n`);
  }

  const labelCache = {};
  async function labelId(name, color) {
    if (!labelCache[name]) labelCache[name] = await ensureLabel(team.id, name, color);
    return labelCache[name];
  }

  const ownerColors = {
    engineering: '#5E6AD2',
    marketing: '#26B5CE',
    leadership: '#F2C94C',
    product: '#BB87FC',
  };

  const results = [];

  for (const epic of plan.epics) {
    console.log(`Epic: ${epic.title}`);
    const epicStateId = resolveStateId(states, epic.status);
    const epicLabels = [await labelId('seo-demand-engine', '#5E6AD2')];

    const epicIssue = await upsertIssue({
      teamId: team.id,
      projectId: project?.id,
      stateId: epicStateId,
      parentId: undefined,
      epicKey: epic.key,
      issue: {
        key: epic.key,
        title: epic.title,
        description: epic.description,
        owner: undefined,
        status: epic.status,
      },
      labelIds: epicLabels,
    });
    results.push(epicIssue);

    const parentId = epicIssue.issue?.id ?? (dryRun ? `dry-epic-${epic.key}` : undefined);

    for (const issue of epic.issues) {
      const stateId = resolveStateId(states, issue.status);
      const labels = [await labelId(`owner:${issue.owner}`, ownerColors[issue.owner] ?? '#95A2B3')];
      if (issue.status === 'blocked') labels.push(await labelId('blocked-phase-0', '#EB5757'));

      const row = await upsertIssue({
        teamId: team.id,
        projectId: project?.id,
        stateId,
        parentId,
        epicKey: epic.key,
        issue,
        labelIds: labels,
      });
      results.push(row);
    }
    console.log('');
  }

  const created = results.filter((r) => r.action === 'create').length;
  const updated = results.filter((r) => r.action === 'update').length;

  console.log('Done.');
  if (dryRun) {
    console.log(`Would sync ${results.length} issues (${plan.epics.length} epics + deliverables).`);
  } else {
    console.log(`${created} created, ${updated} updated.`);
    console.log(`Project: ${project.url}`);
    console.log('\nKeep Linear updated: edit scripts/linear-build-plan.json when the plan changes, re-run sync.');
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
