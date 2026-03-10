'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2, Plus, X } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import type { ServiceItem } from '@/lib/content';

/** Service item shape accepted by the editor (includes editable id) */
type EditableServiceItem = {
  id: string;
  iconKey: string;
  title: string;
  description: string;
  image: string;
  details?: { headline: string; text: string; features: string[] };
};

const ICON_OPTIONS = [
  { value: 'monitor', label: 'Monitor (LED Walls)' },
  { value: 'zap', label: 'Zap (Lighting)' },
  { value: 'mic2', label: 'Mic (Audio)' },
  { value: 'layers', label: 'Layers (Stage Design)' },
  { value: 'boxes', label: 'Boxes (Scenic)' },
  { value: 'projector', label: 'Projector (Projection)' },
] as const;

type ServiceItemEditorProps = {
  service: EditableServiceItem;
  index: number;
  onChange: (service: EditableServiceItem) => void;
  onDelete: () => void;
};

export function ServiceItemEditor({ service, index, onChange, onDelete }: ServiceItemEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const updateField = <K extends keyof EditableServiceItem>(field: K, value: EditableServiceItem[K]) => {
    onChange({ ...service, [field]: value });
  };

  const updateDetailsField = <K extends keyof NonNullable<EditableServiceItem['details']>>(
    field: K,
    value: NonNullable<EditableServiceItem['details']>[K]
  ) => {
    onChange({
      ...service,
      details: {
        ...(service.details || { headline: '', text: '', features: [] }),
        [field]: value,
      },
    });
  };

  const addFeature = () => {
    const features = service.details?.features || [];
    updateDetailsField('features', [...features, '']);
  };

  const updateFeature = (idx: number, value: string) => {
    const features = [...(service.details?.features || [])];
    features[idx] = value;
    updateDetailsField('features', features);
  };

  const removeFeature = (idx: number) => {
    const features = [...(service.details?.features || [])];
    features.splice(idx, 1);
    updateDetailsField('features', features);
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500';
  const textareaClass = `${inputClass} min-h-[80px] resize-y`;

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
      {/* Header */}
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
            {service.title || `Service ${index + 1}`}
          </span>
          {!service.details && (
            <span className="text-xs text-gray-500">(No details)</span>
          )}
        </button>
        <button
          onClick={() => {
            if (confirm('Delete this service?')) {
              onDelete();
            }
          }}
          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors ml-2 shrink-0"
          title="Delete service"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-white/10">
          {/* Basic Fields */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              ID
            </label>
            <input
              type="text"
              value={service.id}
              onChange={(e) => updateField('id', e.target.value)}
              className={inputClass}
              placeholder="service-id"
            />
            <p className="text-gray-500 text-xs mt-1">Unique identifier (e.g., "led-walls")</p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Icon
            </label>
            <select
              value={service.iconKey}
              onChange={(e) => updateField('iconKey', e.target.value)}
              className={inputClass}
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Title
            </label>
            <input
              type="text"
              value={service.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={inputClass}
              placeholder="Service Title"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Description
            </label>
            <textarea
              value={service.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={textareaClass}
              placeholder="Brief description shown on the card"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={service.image}
                onChange={(e) => updateField('image', e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
              <ImageUpload
                folder="services"
                mode="single"
                label="Upload"
                onUpload={(url) => updateField('image', url)}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="border-t border-white/10 pt-4">
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="w-full flex items-center justify-between mb-2"
            >
              <label className="block text-xs uppercase tracking-widest text-gray-500">
                Modal Details {service.details ? '(configured)' : '(optional)'}
              </label>
              {detailsExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {detailsExpanded && (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={service.details?.headline || ''}
                    onChange={(e) => updateDetailsField('headline', e.target.value)}
                    className={inputClass}
                    placeholder="Modal headline"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Description Text
                  </label>
                  <textarea
                    value={service.details?.text || ''}
                    onChange={(e) => updateDetailsField('text', e.target.value)}
                    className={textareaClass}
                    placeholder="Detailed description shown in modal"
                    rows={4}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-500">
                      Features
                    </label>
                    <button
                      onClick={addFeature}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(service.details?.features || []).map((feature, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(idx, e.target.value)}
                          className={inputClass}
                          placeholder={`Feature ${idx + 1}`}
                        />
                        <button
                          onClick={() => removeFeature(idx)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors shrink-0"
                          title="Remove feature"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!service.details?.features || service.details.features.length === 0) && (
                      <p className="text-gray-500 text-xs">No features yet. Click "Add Feature" to add one.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
