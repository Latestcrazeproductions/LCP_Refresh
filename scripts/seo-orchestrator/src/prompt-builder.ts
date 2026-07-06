import fs from 'node:fs';
import path from 'node:path';
import type { Task } from './types.js';

const PROMPT_FILES: Record<string, string> = {
  ResearchAgent: 'research.md',
  PlannerAgent: 'planner.md',
  NationalContentAgent: 'national-content.md',
  GeoBatchAgent: 'geo-batch.md',
  ServiceRefreshAgent: 'service-refresh.md',
  AuthorityContentAgent: 'authority-content.md',
  QAAgent: 'qa-gate.md',
};

function getAgentRef(): string {
  return process.env.CURSOR_AGENT_REF?.trim() || 'development';
}

export function buildAgentPrompt(repoRoot: string, task: Task): string {
  const promptFile = PROMPT_FILES[task.agent] ?? 'planner.md';
  const promptPath = path.join(repoRoot, 'agents/prompts', promptFile);
  const rulesPath = path.join(repoRoot, 'agents/rules/seo-master-plan.mdc');
  const targetBranch = getAgentRef();

  const base = fs.existsSync(promptPath) ? fs.readFileSync(promptPath, 'utf8') : '';
  const rules = fs.existsSync(rulesPath) ? fs.readFileSync(rulesPath, 'utf8') : '';

  return `${base}

---

## Assigned task

- **Type:** ${task.type}
- **Agent:** ${task.agent}
- **Track:** ${task.track}
- **Description:** ${task.description}
${task.url ? `- **URL:** ${task.url}` : ''}
${task.siteId ? `- **Site ID:** ${task.siteId}` : ''}
${task.briefPath ? `- **Brief:** ${task.briefPath}` : ''}

## Instructions

1. Complete this task only. Do not scope-creep.
2. Update \`content-registry/pages.jsonl\` for any page you create or refresh (lastUpdated, nextAction).
3. Open a PR **targeting branch \`${targetBranch}\`** (not \`main\`) with a clear summary listing task type and URLs changed.
4. Do NOT modify Supabase, env files, or CMS auth.

---

${rules}
`;
}
