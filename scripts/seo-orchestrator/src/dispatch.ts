import type { Task } from './types.js';
import { buildAgentPrompt } from './prompt-builder.js';

export interface DispatchResult {
  taskId: string;
  agent: string;
  status: 'finished' | 'error' | 'skipped';
  runId?: string;
  agentId?: string;
  error?: string;
}

const REPO_URL = 'https://github.com/Latestcrazeproductions/LCP_Refresh';

/** PR base branch for agent prompts. Default `development`. */
export function getAgentRef(): string {
  return process.env.CURSOR_AGENT_REF?.trim() || 'development';
}

/** Git clone ref. Cursor requires an explicit branch; default `development`. */
export function getStartingRef(): string {
  return process.env.CURSOR_STARTING_REF?.trim() || 'development';
}

export async function dispatchTask(
  repoRoot: string,
  task: Task,
  apiKey: string
): Promise<DispatchResult> {
  if (task.agent === 'PlannerAgent') {
    return {
      taskId: task.id,
      agent: task.agent,
      status: 'skipped',
      error: 'Planner deterministic tasks run in orchestrator, not cloud agent',
    };
  }

  const prompt = buildAgentPrompt(repoRoot, task);
  const startingRef = getStartingRef();

  try {
    const { Agent, CursorAgentError } = await import('@cursor/sdk');

    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: 'composer-2.5' },
      cloud: {
        repos: [{ url: REPO_URL, startingRef }],
        autoCreatePR: true,
        skipReviewerRequest: true,
      },
    });

    if (result.status === 'error') {
      return {
        taskId: task.id,
        agent: task.agent,
        status: 'error',
        runId: result.id,
        error: 'Agent run finished with error status',
      };
    }

    return {
      taskId: task.id,
      agent: task.agent,
      status: 'finished',
      runId: result.id,
      agentId:
        'agentId' in result && typeof result.agentId === 'string'
          ? result.agentId
          : undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const helpUrl =
      err && typeof err === 'object' && 'helpUrl' in err
        ? String((err as { helpUrl?: string }).helpUrl)
        : undefined;
    if (message.includes('Failed to verify existence of branch') || message.includes('Failed to determine repository default branch')) {
      console.error(`
::error::Cursor cannot read branches on ${REPO_URL}.

This is NOT a wrong branch name — GitHub has main and development.
The Cursor API key's team does not have GitHub access to this repo.

Fix:
  1. https://cursor.com/dashboard → Integrations → GitHub → connect
  2. Install Cursor GitHub App on Latestcrazeproductions with LCP_Refresh access
  3. Use a CURSOR_API_KEY from that same Cursor team (Settings → API Keys)
  4. Run: npm run verify:cursor-github (in scripts/seo-orchestrator)
`);
    }
    if (helpUrl) {
      console.error(`\nCursor integration help: ${helpUrl}`);
      console.error(
        'Connect GitHub at cursor.com/dashboard and grant access to Latestcrazeproductions/LCP_Refresh.'
      );
    }
    const isCursor =
      err &&
      typeof err === 'object' &&
      (err.constructor?.name === 'CursorAgentError' ||
        message.includes('CursorAgentError'));

    if (isCursor) {
      return { taskId: task.id, agent: task.agent, status: 'error', error: message };
    }
    throw err;
  }
}

export async function dispatchTasks(
  repoRoot: string,
  tasks: Task[],
  apiKey: string
): Promise<DispatchResult[]> {
  const results: DispatchResult[] = [];
  for (const task of tasks) {
    if (task.agent === 'PlannerAgent') continue;
    console.log(`Dispatching ${task.type} → ${task.agent}...`);
    const r = await dispatchTask(repoRoot, task, apiKey);
    results.push(r);
    console.log(`  status=${r.status}${r.runId ? ` runId=${r.runId}` : ''}`);
  }
  return results;
}
