'use client';

import { useState } from 'react';
import { Trash2, Plus, X, ArrowLeft } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import type { ServiceItem } from '@/lib/content';

type EditableServiceItem = {
  id: string;
  iconKey: string;
  title: string;
  description: string;
  image: string;
  gallery?: string[];
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
  onBack: () => void;
};

export function ServiceItemEditor({ service, index, onChange, onDelete, onBack }: ServiceItemEditorProps) {
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
  const textareaClass = `${inputClass} min-h-[100px] resize-y`;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </button>
        <button
          onClick={() => {
            if (confirm('Delete this service? This action cannot be undone.')) {
              onDelete();
              onBack();
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Service
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Info */}
        <div className="space-y-6 bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-white mb-4">Core Information</h2>
          
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
              Description
            </label>
            <textarea
              value={service.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={textareaClass}
              placeholder="Brief description shown on the card"
              rows={3}
            />
          </div>
        </div>

        {/* Media & Gallery */}
        <div className="space-y-6 bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-white mb-4">Media</h2>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Primary Image URL
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
            {service.image && (
              <img src={service.image} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg border border-white/10" />
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Gallery (up to 3 images)
            </label>
            <p className="text-gray-500 text-xs mb-4">Shown in a 3-column gallery at the bottom of the page.</p>
            <div className="mb-4">
              <ImageUpload
                folder="services"
                mode="bulk"
                label="Upload gallery images"
                onUpload={(urls) => {
                  const current = service.gallery || [];
                  const next = [...current, ...urls].slice(0, 3);
                  updateField('gallery', next);
                }}
              />
            </div>
            {(service.gallery || []).length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {(service.gallery || []).map((url, idx) => (
                  <div key={idx} className="relative group aspect-square">
                    <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-white/10" />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (service.gallery || []).filter((_, i) => i !== idx);
                        updateField('gallery', next.length ? next : undefined);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Details */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-semibold text-white">Modal Details</h2>
            <p className="text-sm text-gray-500">Expanded information shown when clicking a service.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
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
                  rows={6}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-xs uppercase tracking-widest text-gray-500">
                  Key Features
                </label>
                <button
                  onClick={addFeature}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Feature
                </button>
              </div>
              
              <div className="space-y-3">
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
                      className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                      title="Remove feature"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!service.details?.features || service.details.features.length === 0) && (
                  <div className="py-8 text-center text-sm text-gray-500 border border-dashed border-white/20 rounded-lg">
                    No features added. Click "Add Feature" to create a list.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
