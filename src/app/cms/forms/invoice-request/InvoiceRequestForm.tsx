'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ContactSelect } from './ContactSelect';

const INVOICING_METHODS = [
  'Event/Install: Deposit First, Then Final Invoice Upon Completion of Event/Install',
  'Event/Install: Final Invoice Right Away',
  'Dry Rental: Deposit First, Then Final Invoice On Day of Pick Up',
  "Dry Rental: Pay In Full Before Pick Up",
  "AR's Choice",
] as const;

type InvoiceRequestFormData = {
  salesperson: string;
  lassoEventUrl: string;
  eventName: string;
  nameToSendInvoiceTo: string;
  emailToSendInvoiceTo: string;
  invoicingMethod: string;
  urgency: 'High' | 'Normal' | '';
  additionalNotes: string;
  sendCopyOfResponses: boolean;
};

const initialFormState: InvoiceRequestFormData = {
  salesperson: '',
  lassoEventUrl: '',
  eventName: '',
  nameToSendInvoiceTo: '',
  emailToSendInvoiceTo: '',
  invoicingMethod: '',
  urgency: '',
  additionalNotes: '',
  sendCopyOfResponses: false,
};

export default function InvoiceRequestForm() {
  const [form, setForm] = useState<InvoiceRequestFormData>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/forms/invoice-request', {
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
              Your invoice request has been submitted and will appear in the Form_Responses sheet.
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
          LCP Invoice Request Form - AR
        </h1>
        <p className="text-gray-400 text-sm mb-2">
          To return back to Internal Forms <Link href="/cms/forms" className="text-blue-400 hover:text-blue-300 underline">Click Here</Link>.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          * Indicates required question
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Salesperson <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.salesperson}
              onChange={(e) => setForm((p) => ({ ...p, salesperson: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            >
              <option value="">Choose</option>
              <option value="Steven Grier">Steven Grier</option>
              <option value="Other">Other</option>
            </select>
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Name of Person(s) to Send Invoice To <span className="text-red-500">*</span>
            </label>
            <ContactSelect
              placeholder="Type name to search (min 2 characters)..."
              value={{ name: form.nameToSendInvoiceTo, email: form.emailToSendInvoiceTo }}
              onChange={(contact) =>
                setForm((p) => ({
                  ...p,
                  nameToSendInvoiceTo: contact.name,
                  emailToSendInvoiceTo: contact.email,
                }))
              }
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Email Address(es) of Where To Send Invoice To <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="Auto-filled when you select a contact, or enter manually"
              value={form.emailToSendInvoiceTo}
              onChange={(e) => setForm((p) => ({ ...p, emailToSendInvoiceTo: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Invoicing Method (Choose One) <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {INVOICING_METHODS.map((method) => (
                <label key={method} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="invoicingMethod"
                    required
                    value={method}
                    checked={form.invoicingMethod === method}
                    onChange={(e) => setForm((p) => ({ ...p, invoicingMethod: e.target.value }))}
                    className="mt-1 w-4 h-4 text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {method}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">Urgency</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="High"
                  checked={form.urgency === 'High'}
                  onChange={(e) => setForm((p) => ({ ...p, urgency: e.target.value as 'High' }))}
                  className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500"
                />
                <span className="text-gray-300">High</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="Normal"
                  checked={form.urgency === 'Normal'}
                  onChange={(e) => setForm((p) => ({ ...p, urgency: e.target.value as 'Normal' }))}
                  className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500"
                />
                <span className="text-gray-300">Normal</span>
              </label>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">Additional Notes</label>
            <textarea
              placeholder="Your answer"
              rows={4}
              value={form.additionalNotes}
              onChange={(e) => setForm((p) => ({ ...p, additionalNotes: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-y min-h-[100px]"
            />
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
