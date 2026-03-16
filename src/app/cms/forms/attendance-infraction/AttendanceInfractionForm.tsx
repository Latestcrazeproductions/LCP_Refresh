'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

const POLICY_URL = 'https://docs.google.com/document/d/1HMQnGQIRIA4B7L6LPPISnFHWwer2ulx2fYrh8RGgIOE/edit?usp=sharing';

const INFRACTION_TYPES = ['Tardy', 'Call Out', 'No Call/No Show'] as const;

const ACTION_OPTIONS = [
  'None Yet',
  'Verbal Reminder (can be done onsite by supervisor)',
  'Written Warning (to be done by HR)',
  'Suspension Review (to be done by HR)',
  'Termination Review (to be done by HR)',
] as const;

type AttendanceFormData = {
  supervisorName: string;
  employeeName: string;
  infractionDate: string;
  eventName: string;
  infractionType: string;
  minutesLate: string;
  reasonProvided: string;
  actionTaken: string;
  sendCopyOfResponses: boolean;
};

const initialFormState: AttendanceFormData = {
  supervisorName: '',
  employeeName: '',
  infractionDate: '',
  eventName: '',
  infractionType: '',
  minutesLate: '',
  reasonProvided: '',
  actionTaken: '',
  sendCopyOfResponses: false,
};

const formFieldClass =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500';

export default function AttendanceInfractionForm() {
  const [form, setForm] = useState<AttendanceFormData>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/forms/attendance-infraction', {
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
            <h2 className="text-xl font-semibold text-white mb-2">Infraction logged</h2>
            <p className="text-gray-400 mb-6">The attendance infraction has been submitted.</p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Submit another
              </button>
              <Link
                href="/cms/forms"
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
          href="/cms/forms"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Internal Forms
        </Link>

        <h1 className="text-2xl font-display font-bold text-white mb-2">
          Employee Attendance Infraction Log - LCP
        </h1>
        <p className="text-gray-400 text-sm mb-2">
          For supervisors to log employee tardy, call out, and no call/no show infractions.{' '}
          <a
            href={POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Here&apos;s the link to LCP&apos;s current policy
          </a>
          . Please review if needed before reporting infraction.
        </p>
        <p className="text-gray-400 text-sm mb-8">* Indicates required question</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Supervisor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your answer"
              value={form.supervisorName}
              onChange={(e) => setForm((p) => ({ ...p, supervisorName: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your answer"
              value={form.employeeName}
              onChange={(e) => setForm((p) => ({ ...p, employeeName: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Date of Infraction <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={form.infractionDate}
              onChange={(e) => setForm((p) => ({ ...p, infractionDate: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Event Name (type warehouse if warehouse shift) <span className="text-red-500">*</span>
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
              Infraction Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {INFRACTION_TYPES.map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="infractionType"
                    required
                    value={opt}
                    checked={form.infractionType === opt}
                    onChange={(e) => setForm((p) => ({ ...p, infractionType: e.target.value }))}
                    className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 group-hover:text-white">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">Minutes Late (if applicable)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Your answer"
              value={form.minutesLate}
              onChange={(e) => setForm((p) => ({ ...p, minutesLate: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">Reason Provided by Employee</label>
            <textarea
              placeholder="Your answer"
              rows={4}
              value={form.reasonProvided}
              onChange={(e) => setForm((p) => ({ ...p, reasonProvided: e.target.value }))}
              className={`${formFieldClass} resize-y min-h-[100px]`}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Action Taken <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {ACTION_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="actionTaken"
                    required
                    value={opt}
                    checked={form.actionTaken === opt}
                    onChange={(e) => setForm((p) => ({ ...p, actionTaken: e.target.value }))}
                    className="mt-1 w-4 h-4 text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 group-hover:text-white">{opt}</span>
                </label>
              ))}
            </div>
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
