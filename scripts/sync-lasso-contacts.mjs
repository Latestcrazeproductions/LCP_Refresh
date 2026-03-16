#!/usr/bin/env node
/**
 * Sync LASSO contacts to Supabase invoice_contacts.
 * Run nightly via cron: 0 2 * * * (2am daily)
 *
 * Env: LASSO_API_URL, LASSO_API_KEY, LASSO_CONTACTS_ENDPOINT (optional),
 *      SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LASSO_API_URL = process.env.LASSO_API_URL?.replace(/\/$/, '');
const LASSO_API_KEY = process.env.LASSO_API_KEY;
const LASSO_CONTACTS_ENDPOINT = process.env.LASSO_CONTACTS_ENDPOINT || '/v1/contacts';

function log(...args) {
  const ts = new Date().toISOString();
  console.log(`[${ts}]`, ...args);
}

function logErr(...args) {
  const ts = new Date().toISOString();
  console.error(`[${ts}]`, ...args);
}

/** Fetch contacts from LASSO. Adapt this to your LASSO API response shape. */
async function fetchLassoContacts() {
  if (!LASSO_API_URL || !LASSO_API_KEY) {
    throw new Error('LASSO_API_URL and LASSO_API_KEY are required');
  }

  const url = LASSO_CONTACTS_ENDPOINT.startsWith('http')
    ? LASSO_CONTACTS_ENDPOINT
    : `${LASSO_API_URL}${LASSO_CONTACTS_ENDPOINT}`;

  const headers = {
    'lasso-api-key': LASSO_API_KEY,
    Accept: 'application/json',
  };

  log('Fetching from', url);
  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`LASSO API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // Normalize response - LASSO may return { data: [...] } or [{...}]
  let items = Array.isArray(data) ? data : data?.data ?? data?.contacts ?? data?.results ?? [];
  if (!Array.isArray(items)) items = [];

  const contacts = items
    .filter((r) => r && (r.email || r.Email))
    .map((r) => ({
      name: String(r.name ?? r.Name ?? r.fullName ?? r.displayName ?? '').trim() || 'Unknown',
      email: String(r.email ?? r.Email ?? '').trim().toLowerCase(),
      company: r.company ?? r.Company ?? r.companyName ?? null,
    }))
    .filter((c) => c.email && c.email.includes('@'));

  // Dedupe by email (last wins)
  const byEmail = new Map();
  for (const c of contacts) byEmail.set(c.email, c);
  return Array.from(byEmail.values());
}

/** Upsert contacts into Supabase */
async function syncToSupabase(contacts) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const rows = contacts.map((c) => ({
    name: c.name,
    email: c.email,
    company: c.company || null,
  }));

  const { data, error } = await supabase
    .from('invoice_contacts')
    .upsert(rows, {
      onConflict: 'email',
      ignoreDuplicates: false,
    });

  if (error) throw error;
  return data?.length ?? rows.length;
}

async function main() {
  try {
    log('Starting LASSO contacts sync');
    const contacts = await fetchLassoContacts();
    log('Fetched', contacts.length, 'contacts from LASSO');

    if (contacts.length === 0) {
      log('No contacts to sync');
      process.exit(0);
      return;
    }

    await syncToSupabase(contacts);
    log('Synced', contacts.length, 'contacts to Supabase');
    process.exit(0);
  } catch (err) {
    logErr('Sync failed:', err.message);
    process.exit(1);
  }
}

main();
