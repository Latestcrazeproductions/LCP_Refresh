'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';

const PAYMENT_TYPES = [
  'Event Submittal Payment',
  'Event Subcontractor Payment',
  'Event Consumables/Materials Purchase',
  'Products For Resale Purchase',
  'Reimbursement',
  'Warehouse/Office Supplies Purchase',
  'Repair/Maintenance Service Payment',
  'Other',
] as const;

const PAYMENT_METHODS = [
  'Check',
  'ACH / Direct Deposit',
  'Credit Card',
  'Zelle',
  "Don't Know",
  'Other',
] as const;

type PayablesFormData = {
  paymentNotes: string;
  paymentType: string;
  vendorPayeeName: string;
  paymentAmount: string;
  paymentDueDate: string;
  descriptionPurpose: string;
  purchaseOrderNumber: string;
  eventCode: string;
  paymentMethod: string;
  payeePaymentDetails: string;
  sendCopyOfResponses: boolean;
};

const initialFormState: PayablesFormData = {
  paymentNotes: '',
  paymentType: '',
  vendorPayeeName: '',
  paymentAmount: '',
  paymentDueDate: '',
  descriptionPurpose: '',
  purchaseOrderNumber: '',
  eventCode: '',
  paymentMethod: '',
  payeePaymentDetails: '',
  sendCopyOfResponses: false,
};

const formFieldClass =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500';

export default function PayablesForm() {
  const [form, setForm] = useState<PayablesFormData>(initialFormState);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File must be 10 MB or less');
      return;
    }

    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|gif|doc|docx)$/i)) {
      setError('Please upload PDF, image, or Word document');
      return;
    }

    setInvoiceFile(file);
    setError(null);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'payables-invoices');

      const res = await fetch('/api/forms/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setInvoiceUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setInvoiceFile(null);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeFile() {
    setInvoiceFile(null);
    setInvoiceUrl(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!invoiceUrl && !invoiceFile) {
      setError('Please upload an invoice');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/forms/payables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, invoiceUrl: invoiceUrl || '' }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setSuccess(true);
      setForm(initialFormState);
      setInvoiceFile(null);
      setInvoiceUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }

  function handleClear() {
    setForm(initialFormState);
    setInvoiceFile(null);
    setInvoiceUrl(null);
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
            <p className="text-gray-400 mb-6">Your payables request has been submitted.</p>
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
          LCP Payables Request Form - AP
        </h1>
        <p className="text-gray-400 text-sm mb-2">
          To return back to Internal Forms <Link href="/cms/forms" className="text-blue-400 hover:text-blue-300 underline">Click Here</Link>.
        </p>
        <p className="text-gray-400 text-sm mb-8">* Indicates required question</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">Payment Notes or Details</label>
            <textarea
              placeholder="Your answer"
              rows={3}
              value={form.paymentNotes}
              onChange={(e) => setForm((p) => ({ ...p, paymentNotes: e.target.value }))}
              className={`${formFieldClass} resize-y min-h-[80px]`}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Payment Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {PAYMENT_TYPES.map((pt) => (
                <label key={pt} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="paymentType"
                    required
                    value={pt}
                    checked={form.paymentType === pt}
                    onChange={(e) => setForm((p) => ({ ...p, paymentType: e.target.value }))}
                    className="mt-1 w-4 h-4 text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 group-hover:text-white">{pt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Vendor / Payee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your answer"
              value={form.vendorPayeeName}
              onChange={(e) => setForm((p) => ({ ...p, vendorPayeeName: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Payment Amount (USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              inputMode="decimal"
              placeholder="Your answer"
              value={form.paymentAmount}
              onChange={(e) => setForm((p) => ({ ...p, paymentAmount: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Payment Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={form.paymentDueDate}
              onChange={(e) => setForm((p) => ({ ...p, paymentDueDate: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">Description / Purpose of Payment</label>
            <textarea
              placeholder="Your answer"
              rows={3}
              value={form.descriptionPurpose}
              onChange={(e) => setForm((p) => ({ ...p, descriptionPurpose: e.target.value }))}
              className={`${formFieldClass} resize-y min-h-[80px]`}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Supporting Documentation — Please Upload Invoice <span className="text-red-500">*</span>
            </label>
            <p className="text-gray-400 text-xs mb-3">Upload 1 supported file. Max 10 MB. PDF, image, or Word.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            {invoiceFile ? (
              <div className="flex items-center justify-between gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-gray-300 truncate">{invoiceFile.name}</span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-400 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading...' : 'Add File'}
              </button>
            )}
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">Purchase Order Number (optional)</label>
            <input
              type="text"
              placeholder="Your answer"
              value={form.purchaseOrderNumber}
              onChange={(e) => setForm((p) => ({ ...p, purchaseOrderNumber: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">Event Code (optional)</label>
            <input
              type="text"
              placeholder="Your answer"
              value={form.eventCode}
              onChange={(e) => setForm((p) => ({ ...p, eventCode: e.target.value }))}
              className={formFieldClass}
            />
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">
              Preferred Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((pm) => (
                <label key={pm} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="paymentMethod"
                    required
                    value={pm}
                    checked={form.paymentMethod === pm}
                    onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))}
                    className="mt-1 w-4 h-4 text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 group-hover:text-white">{pm}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <label className="block text-white font-medium mb-2">Payee Payment Details (optional)</label>
            <textarea
              placeholder="Your answer"
              rows={2}
              value={form.payeePaymentDetails}
              onChange={(e) => setForm((p) => ({ ...p, payeePaymentDetails: e.target.value }))}
              className={`${formFieldClass} resize-y`}
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
              disabled={submitting || uploading}
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
