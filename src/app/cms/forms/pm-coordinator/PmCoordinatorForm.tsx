'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ContactSelect } from '../invoice-request/ContactSelect';

const SCOPE_OPTIONS = [
  'Full Production Management',
  'Load-in/Load-out Coordination Only',
  'On-Site Day-of Coordination',
  'Pre-Event Planning & Logistics',
  'Technical Coordination Only',
  'Other',
] as const;

type PmCoordinatorFormData = {
  salesperson: string;
  salespersonEmail: string;
  lassoEventUrl: string;
  eventName: string;
  eventDate: string;
  showDays: string;
  loadInDate: string;
  loadInTime: string;
  scope: string;
  sendCopyOfResponses: boolean;
};

const initialFormState: PmCoordinatorFormData = {
  salesperson: '',
  salespersonEmail: '',
  lassoEventUrl: '',
  eventName: '',
  eventDate: '',
  showDays: '',
  loadInDate: '',
  loadInTime: '',
  scope: '',
  sendCopyOfResponses: false,
};

const formFieldClass =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500';

export default function PmCoordinatorForm() {
  const [form, setForm] = useState<PmCoordinatorFormData>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/forms/pm-coordinator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setSuccess(true);
      setForm(initialFormState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }

  function handleClear() {
    setForm(initialFormState);
    setError(null);
    setSuccess(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Request submitted</h2>
            <p className="text-gray-400 mb-6">
              Your PM/Coordinator request has been submitted.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Submit another
              </button>
              <Link
                href="/internal-forms"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Back to Internal Forms
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/internal-forms"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Internal Forms
        </Link>

        <h1 className="text-2xl font-display font-bold text-white mb-2">
          Project Manager/Coordinator Request Form
        </h1>
        <p className="text-gray-400 text-sm mb-2">
          To return back to Internal Forms <Link href="/internal-forms" className="text-blue-400 hover:text-blue-300 underline">Click Here</Link>.
        </p>
        <p className="text-gray-400 text-sm mb-8">* Indicates required question</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Salesperson <span className="text-red-500">*</span>
            </label>
            <ContactSelect
              placeholder="Type name to search contacts..."
              value={{ name: form.salesperson, email: form.salespersonEmail }}
              onChange={(c) =>
                setForm((p) => ({ ...p, salesperson: c.name, salespersonEmail: c.email }))
              }
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Lasso Event URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="Your answer"
              value={form.lassoEventUrl}
              onChange={(e) => setForm((p) => ({ ...p, lassoEventUrl: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your answer"
              value={form.eventName}
              onChange={(e) => setForm((p) => ({ ...p, eventName: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Date of the Event (First Day if multi-day) <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={form.eventDate}
              onChange={(e) => setForm((p) => ({ ...p, eventDate: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              How many show days? <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              placeholder="Your answer"
              value={form.showDays}
              onChange={(e) => setForm((p) => ({ ...p, showDays: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Date and time of load in (if you know it already)
            </label>
            <div className="flex gap-4 flex-wrap">
              <input
                type="date"
                placeholder="mm/dd/yyyy"
                value={form.loadInDate}
                onChange={(e) => setForm((p) => ({ ...p, loadInDate: e.target.value }))}
                className={formFieldClass}
              />
              <input
                type="time"
                value={form.loadInTime}
                onChange={(e) => setForm((p) => ({ ...p, loadInTime: e.target.value }))}
                className={formFieldClass}
              />
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Scope of Project Management or Coordination Needed <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.scope}
              onChange={(e) => setForm((p) => ({ ...p, scope: e.target.value }))}
              className={formFieldClass}
            >
              <option value="">Choose</option>
              {SCOPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.sendCopyOfResponses}
                onChange={(e) => setForm((p) => ({ ...p, sendCopyOfResponses: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Send me a copy of my responses</span>
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Clear form
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
