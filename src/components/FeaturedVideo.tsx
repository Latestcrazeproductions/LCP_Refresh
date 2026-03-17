'use client';

import { useContent } from '@/context/ContentContext';

/**
 * Parse YouTube URL to extract video ID and optional start time (seconds).
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
function parseYouTubeUrl(url: string): { id: string; start?: number } | null {
  if (!url?.trim()) return null;
  const u = url.trim();
  let id: string | null = null;
  let start: number | undefined;

  // youtu.be/VIDEO_ID?t=30
  const shortMatch = u.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)(?:\?.*t=(\d+))?/);
  if (shortMatch) {
    id = shortMatch[1];
    if (shortMatch[2]) start = parseInt(shortMatch[2], 10);
  }

  // youtube.com/watch?v=VIDEO_ID&t=30s or t=30
  if (!id) {
    const watchMatch = u.match(/(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]+)(?:&.*t=(\d+)(?:s)?)?/);
    if (watchMatch) {
      id = watchMatch[1];
      if (watchMatch[2]) start = parseInt(watchMatch[2], 10);
    }
  }

  // youtube.com/embed/VIDEO_ID
  if (!id) {
    const embedMatch = u.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    if (embedMatch) id = embedMatch[1];
  }

  if (!id) return null;
  return { id, start };
}

export default function FeaturedVideo() {
  const { featuredVideo } = useContent();
  const url = featuredVideo?.youtubeUrl?.trim();
  const parsed = url ? parseYouTubeUrl(url) : null;

  if (!parsed) return null;

  const embedSrc = `https://www.youtube.com/embed/${parsed.id}?rel=0${parsed.start != null ? `&start=${parsed.start}` : ''}`;

  return (
    <section className="relative py-16 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
          <iframe
            src={embedSrc}
            title="Featured video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
