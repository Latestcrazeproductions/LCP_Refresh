'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Inbox, Calendar, MapPin, Users, Phone, Mail, Building, Sparkles } from 'lucide-react';
import { generatePitchRecommendation } from './ai-actions';

type Submission = {
  id: string;
  name: string;
  email: string;
  company?: string;
  project_details?: string;
  phone?: string;
  venue?: string;
  event_location?: string;
  event_type?: string;
  event_date?: string;
  attendee_count?: string;
  referral_source?: string;
  timeline?: string;
  created_at: string;
};

export function SubmissionsViewer() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Record<string, string>>({});
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const handleGenerateAI = async (sub: Submission) => {
    setGeneratingFor(sub.id);
    const { result, error } = await generatePitchRecommendation(sub);
    setGeneratingFor(null);
    if (error) {
      alert(error);
    } else if (result) {
      setRecommendations(prev => ({ ...prev, [sub.id]: result }));
    }
  };

  useEffect(() => {
    async function fetchSubmissions() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setSubmissions(data as Submission[]);
      setLoading(false);
    }
    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-gray-500 border border-dashed border-white/10 rounded-xl">
        <Inbox className="w-12 h-12 mb-4 text-gray-600" />
        <p>No form submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {submissions.map((sub) => (
        <div key={sub.id} className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{sub.name}</h3>
              <p className="text-gray-400 text-sm flex items-center gap-4 flex-wrap mt-2">
                <a href={`mailto:${sub.email}`} className="text-blue-400 hover:text-blue-300 flex items-center gap-1"><Mail className="w-3 h-3" /> {sub.email}</a>
                {sub.phone && <a href={`tel:${sub.phone}`} className="text-gray-400 hover:text-white flex items-center gap-1"><Phone className="w-3 h-3" /> {sub.phone}</a>}
                {sub.company && <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {sub.company}</span>}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full inline-flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {new Date(sub.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {sub.event_type && (
               <div>
                 <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Event Type</span>
                 <p className="text-white text-sm">{sub.event_type}</p>
               </div>
            )}
            {sub.event_date && (
               <div>
                 <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Target Date</span>
                 <p className="text-white text-sm">{sub.event_date}</p>
               </div>
            )}
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Venue</span>
              <p className="text-white text-sm flex items-center gap-1"><Building className="w-3 h-3 text-gray-500" /> {sub.venue || 'N/A'}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Location</span>
              <p className="text-white text-sm flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-500" /> {sub.event_location || 'N/A'}</p>
            </div>
            {sub.attendee_count && (
               <div>
                 <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Attendees</span>
                 <p className="text-white text-sm flex items-center gap-1"><Users className="w-3 h-3 text-gray-500" /> {sub.attendee_count}</p>
               </div>
            )}
            {sub.timeline && (
               <div>
                 <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Timeline</span>
                 <p className="text-white text-sm text-yellow-400/90">{sub.timeline}</p>
               </div>
            )}
            {sub.referral_source && (
               <div>
                 <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Source</span>
                 <p className="text-white text-sm">{sub.referral_source}</p>
               </div>
            )}
          </div>

          {sub.project_details && (
            <div className="bg-white/5 rounded-lg p-4 md:p-6 border border-white/5 mb-6">
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Project Details & Message</span>
              <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{sub.project_details}</p>
            </div>
          )}

          <div className="pt-6 border-t border-white/10">
            {recommendations[sub.id] ? (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 relative">
                <div className="flex items-center gap-2 mb-4 text-blue-400">
                  <Sparkles className="w-5 h-5" />
                  <h4 className="font-display font-semibold">AI Pitch Recommendation</h4>
                </div>
                <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-300">
                  {recommendations[sub.id].split('\n\n').map((para, i) => (
                    <p key={i} className="mb-4 last:mb-0">{para}</p>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleGenerateAI(sub)}
                disabled={generatingFor === sub.id}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-700 text-white text-sm font-medium rounded-lg transition-all"
              >
                {generatingFor === sub.id ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Submission...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate AI Pitch Recommendation</>
                )}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
