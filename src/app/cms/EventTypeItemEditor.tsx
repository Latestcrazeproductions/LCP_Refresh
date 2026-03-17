'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import type { EventTypeItem } from '@/lib/content';

type EditableEventTypeItem = EventTypeItem;

type EventTypeItemEditorProps = {
  eventType: EditableEventTypeItem;
  index: number;
  onChange: (eventType: EditableEventTypeItem) => void;
  onDelete: () => void;
};

export function EventTypeItemEditor({
  eventType,
  index,
  onChange,
  onDelete,
}: EventTypeItemEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const updateField = <K extends keyof EditableEventTypeItem>(
    field: K,
    value: EditableEventTypeItem[K]
  ) => {
    onChange({ ...eventType, [field]: value });
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500';
  const textareaClass = `${inputClass} min-h-[80px] resize-y`;

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
      <div className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center gap-3 text-left"
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          <span className="font-display font-medium text-white">
            {eventType.title || `Event Type ${index + 1}`}
          </span>
          {(eventType.gallery?.length ?? 0) > 0 ? (
            <span className="text-xs text-green-400 ml-2">• Gallery: {eventType.gallery?.length} image{eventType.gallery?.length !== 1 ? 's' : ''}</span>
          ) : (
            <span className="text-xs text-amber-500/80 ml-2">• Gallery: add images</span>
          )}
        </button>
        <button
          onClick={() => {
            if (confirm('Delete this event type?')) {
              onDelete();
            }
          }}
          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors ml-2 shrink-0"
          title="Delete event type"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4 border-t border-white/10">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              ID
            </label>
            <input
              type="text"
              value={eventType.id}
              onChange={(e) => updateField('id', e.target.value)}
              className={inputClass}
              placeholder="event-type-id"
            />
            <p className="text-gray-500 text-xs mt-1">
              Unique identifier (e.g., &quot;corporate-keynotes&quot;)
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Title
            </label>
            <input
              type="text"
              value={eventType.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={inputClass}
              placeholder="Event Type Title"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Description
            </label>
            <textarea
              value={eventType.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={textareaClass}
              placeholder="Brief description shown on the card"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={eventType.image}
                onChange={(e) => updateField('image', e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
              <ImageUpload
                folder="event-types"
                mode="single"
                label="Upload"
                onUpload={(url) => updateField('image', url)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Gallery (up to 3 images)
            </label>
            <p className="text-gray-500 text-xs mb-2">Upload images to showcase this event type. Shown in a 3-column gallery at the bottom of the page.</p>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <ImageUpload
                folder="event-types"
                mode="bulk"
                label="Upload gallery images"
                onUpload={(urls) => {
                  const current = eventType.gallery || [];
                  const next = [...current, ...urls].slice(0, 3);
                  updateField('gallery', next);
                }}
              />
            </div>
            {(eventType.gallery || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(eventType.gallery || []).map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt="" className="w-16 h-16 object-cover rounded border border-white/10" />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (eventType.gallery || []).filter((_, i) => i !== idx);
                        updateField('gallery', next.length ? next : undefined);
                      }}
                      className="absolute -top-1 -right-1 p-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
