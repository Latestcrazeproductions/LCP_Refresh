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

const REPO_URL = 'github.com/Latestcrazeproductions/LCP_Refresh';

/** Base ref for cloud agents. Default `development` (integration trunk); override with CURSOR_AGENT_REF. */
export function getAgentRef(): string {
  return process.env.CURSOR_AGENT_REF?.trim() || 'development';
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

  try {
    const { Agent, CursorAgentError } = await import('@cursor/sdk');

    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: 'composer-2.5' },
      cloud: {
        repos: [{ url: REPO_URL, ref: getAgentRef() }],
        autoCreatePr: true,
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
      agentId: result.agentId,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
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
