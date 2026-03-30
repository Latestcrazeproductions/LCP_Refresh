'use client';

import { useState } from 'react';
import { saveContent } from '@/app/cms/actions';
import {
  isAllowedStaffEmail,
  parseStaffEmailInput,
  STAFF_EMAIL_DOMAIN,
  type CmsAppSettings,
} from '@/lib/cms-app-settings';

type Props = {
  initialSettings: CmsAppSettings;
};

export default function SettingsEditor({ initialSettings }: Props) {
  const [staffInquiryEmails, setStaffInquiryEmails] = useState(
    () => initialSettings.staffInquiryEmails.join('\n') + (initialSettings.staffInquiryEmails.length ? '\n' : '')
  );
  const [sendThankYouEmail, setSendThankYouEmail] = useState(
    initialSettings.sendThankYouEmail
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    const candidates = parseStaffEmailInput(staffInquiryEmails);
    for (const e of candidates) {
      if (!isAllowedStaffEmail(e)) {
        setMessage(
          `Each address must be a valid ${STAFF_EMAIL_DOMAIN} email. Invalid: ${e}`
        );
        setSaving(false);
        return;
      }
    }

    const unique = [...new Set(candidates.map((e) => e.toLowerCase()))];

    const payload: CmsAppSettings = {
      staffInquiryEmails: unique,
      sendThankYouEmail,
    };

    try {
      const result = await saveContent('settings', payload);

      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage('Saved. Staff will receive new inquiries at the addresses above.');
        setStaffInquiryEmails(unique.join('\n') + (unique.length ? '\n' : ''));
      }
    } catch {
      setMessage('An error occurred while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/5 border border-white/10 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-2">Staff inquiry notifications</h2>
        <p className="text-gray-400 text-sm mb-6">
          When someone submits the public contact form, we email these addresses (via Google Workspace SMTP
          or legacy Resend) with the inquiry details. Only addresses ending in{' '}
          <span className="text-gray-300">{STAFF_EMAIL_DOMAIN}</span> are allowed. Submissions are always
          stored in Supabase regardless of email delivery.
        </p>
        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="staff-emails">
          Staff email addresses (one per line)
        </label>
        <textarea
          id="staff-emails"
          rows={6}
          value={staffInquiryEmails}
          onChange={(e) => setStaffInquiryEmails(e.target.value)}
          placeholder={`sales${STAFF_EMAIL_DOMAIN}\nops${STAFF_EMAIL_DOMAIN}`}
          className="w-full rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-gray-600 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <p className="text-gray-500 text-xs mt-2">
          Requires <code className="text-gray-400">SUPABASE_SERVICE_ROLE_KEY</code> on the server to load
          these settings. Outbound mail needs <code className="text-gray-400">SMTP_USER</code> +{' '}
          <code className="text-gray-400">SMTP_PASS</code> (Workspace) or legacy{' '}
          <code className="text-gray-400">RESEND_API_KEY</code>.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Send thank-you emails to visitors</h3>
            <p className="text-gray-400 text-sm">
              When enabled, the submitter receives an automated thank-you message. Staff notifications are sent
              whenever addresses are configured above, independent of this toggle.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={sendThankYouEmail}
              onChange={(e) => setSendThankYouEmail(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
        {message && (
          <p
            className={`text-sm ${message.startsWith('Saved') ? 'text-green-400' : 'text-red-400'}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
