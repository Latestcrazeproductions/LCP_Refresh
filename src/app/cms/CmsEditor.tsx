'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Save,
  Loader2,
  FileText,
  Building2,
  Zap,
  Briefcase,
  Mail,
  Trash2,
  GripVertical,
  Plus,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createClient } from '@/lib/supabase/client';
import { saveContent } from './actions';
import { ImageUpload } from './ImageUpload';
import { ServiceItemEditor } from './ServiceItemEditor';
import { EventTypeItemEditor } from './EventTypeItemEditor';
import type { SiteContent, EditableSiteContent } from '@/lib/content';

async function fetchContent(): Promise<SiteContent> {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error('Failed to fetch content');
  return res.json();
}

function getImageLabel(url: string, index: number): string {
  const part = url.split('/').pop() ?? '';
  // Remove query params if present
  const filename = part.split('?')[0];
  // Truncate if too long
  return filename.length > 30 ? filename.slice(0, 27) + '...' : filename || `Slide ${index + 1}`;
}

function SortableEventTypeItem({
  eventType,
  index,
  sortableId,
  onChange,
  onDelete,
}: {
  eventType: EditableSiteContent['eventTypes']['items'][0];
  index: number;
  sortableId: string;
  onChange: (eventType: EditableSiteContent['eventTypes']['items'][0]) => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-stretch gap-2">
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-8 shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 rounded cursor-grab active:cursor-grabbing transition-colors"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <EventTypeItemEditor
          eventType={eventType}
          index={index}
          onChange={onChange}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

function SortableImageCard({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden bg-white/5 border border-white/10 aspect-video"
    >
      <img src={url} alt={getImageLabel(url, index)} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded transition-colors opacity-90 group-hover:opacity-100 z-10"
        title="Remove from slideshow"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded cursor-grab active:cursor-grabbing transition-colors z-10"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <span className="absolute bottom-2 left-2 text-[10px] text-white/80 bg-black/60 px-1.5 py-0.5 rounded max-w-[calc(100%-4rem)] truncate">
        {getImageLabel(url, index)}
      </span>
    </div>
  );
}

export default function CmsEditor() {
  const [content, setContent] = useState<EditableSiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    brand: true,
    hero: true,
    work: false,
    services: false,
    eventTypes: false,
    contact: true,
  });
  const router = useRouter();

  useEffect(() => {
    fetchContent()
      .then((c) => setContent(JSON.parse(JSON.stringify(c)) as EditableSiteContent))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/cms/login');
    router.refresh();
  }

  async function handleSave(key: string, value: unknown) {
    setSaving(key);
    const result = await saveContent(key as keyof SiteContent, value);
    setSaving(null);
    if (result.error) {
      alert(result.error);
    } else {
      setContent((prev) => (prev ? { ...prev, [key]: value } : null));
    }
  }

  function toggleSection(id: string) {
    setExpanded((p) => ({ ...p, [id]: !p[id] }));
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleHeroDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !content) return;

    const oldIndex = content.hero.images.findIndex((url) => url === active.id);
    const newIndex = content.hero.images.findIndex((url) => url === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      setContent((p) =>
        p
          ? {
              ...p,
              hero: {
                ...p.hero,
                images: arrayMove(p.hero.images, oldIndex, newIndex),
              },
            }
          : null
      );
    }
  }

  function handleEventTypesDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !content) return;

    const items = content.eventTypes?.items ?? [];
    const getId = (item: (typeof items)[0], i: number) => item.id || `et-${i}`;
    const oldIndex = items.findIndex((item, i) => getId(item, i) === active.id);
    const newIndex = items.findIndex((item, i) => getId(item, i) === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      setContent((p) =>
        p
          ? {
              ...p,
              eventTypes: {
                ...p.eventTypes!,
                items: arrayMove(p.eventTypes?.items ?? [], oldIndex, newIndex),
              },
            }
          : null
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-8 text-center text-red-400">
        Failed to load content. Ensure Supabase is configured and the migration has run.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <header className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
        <h1 className="text-xl font-display font-bold text-white">
          Site Content
        </h1>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </header>

      <p className="text-gray-500 text-sm mb-8">
        Edits follow the structure in{' '}
        <code className="text-gray-400">public/CONTENT_GUIDE.md</code>. Save each
        section to publish changes.
      </p>

      {/* Brand */}
      <Section
        id="brand"
        icon={<Building2 className="w-4 h-4" />}
        title="Brand"
        expanded={expanded.brand}
        onToggle={() => toggleSection('brand')}
      >
        <SectionField label="Name" value={content.brand.name} onChange={(v) => setContent((p) => p && { ...p, brand: { ...p.brand, name: v } })} />
        <SectionField label="Full Name" value={content.brand.nameFull} onChange={(v) => setContent((p) => p && { ...p, brand: { ...p.brand, nameFull: v } })} />
        <div className="flex flex-wrap items-end gap-4">
          <SectionField label="Logo" value={content.brand.logo ?? ''} onChange={(v) => setContent((p) => p && { ...p, brand: { ...p.brand, logo: v || null } })} placeholder="/logos/company/logo.svg" />
          <ImageUpload folder="logos/company" mode="single" label="Upload logo" onUpload={(url: string) => setContent((p) => p && { ...p, brand: { ...p.brand, logo: url } })} />
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <SectionField label="Logo Dark" value={content.brand.logoDark ?? ''} onChange={(v) => setContent((p) => p && { ...p, brand: { ...p.brand, logoDark: v || null } })} placeholder="/logos/company/logo-dark.svg" />
          <ImageUpload folder="logos/company" mode="single" label="Upload logo dark" onUpload={(url: string) => setContent((p) => p && { ...p, brand: { ...p.brand, logoDark: url } })} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Logo size (navbar height)</label>
          <select
            value={content.brand.logoHeight ?? 64}
            onChange={(e) => setContent((p) => p && { ...p, brand: { ...p.brand, logoHeight: Number(e.target.value) } })}
            className="w-full max-w-xs bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          >
            <option value={32}>Small (32px)</option>
            <option value={40}>Medium (40px)</option>
            <option value={48}>48px</option>
            <option value={56}>56px</option>
            <option value={64}>Large (64px)</option>
            <option value={80}>X-Large (80px)</option>
            <option value={96}>96px</option>
            <option value={112}>112px</option>
            <option value={128}>128px</option>
            <option value={160}>160px</option>
            <option value={200}>XX-Large (200px)</option>
          </select>
          <p className="text-gray-500 text-xs mt-1">Logo height in the navbar. Only applies when using a logo image.</p>
        </div>
        <SaveButton saving={saving === 'brand'} onSave={() => handleSave('brand', content.brand)} />
      </Section>

      {/* Hero */}
      <Section
        id="hero"
        icon={<Zap className="w-4 h-4" />}
        title="Hero"
        expanded={expanded.hero}
        onToggle={() => toggleSection('hero')}
      >
        <SectionField label="Eyebrow" value={content.hero.eyebrow} onChange={(v) => setContent((p) => p && { ...p, hero: { ...p.hero, eyebrow: v } })} />
        <SectionField label="Headline" value={content.hero.headline} onChange={(v) => setContent((p) => p && { ...p, hero: { ...p.hero, headline: v } })} textarea />
        <SectionField label="Subhead" value={content.hero.subhead} onChange={(v) => setContent((p) => p && { ...p, hero: { ...p.hero, subhead: v } })} textarea />
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Hero slideshow images</label>
          <p className="text-gray-500 text-xs mb-2">Images cycle in the hero background. Click remove to delete one.</p>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <ImageUpload folder="hero" mode="bulk" label="Bulk upload" onUpload={(urls) => setContent((p) => p && { ...p, hero: { ...p.hero, images: [...(p.hero.images || []), ...urls] } })} />
          </div>
          {content.hero.images.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-500">Current slideshow images — drag to reorder, click remove to delete:</p>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleHeroDragEnd}
              >
                <SortableContext
                  items={content.hero.images}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {content.hero.images.map((url, i) => (
                      <SortableImageCard
                        key={url}
                        url={url}
                        index={i}
                        onRemove={() =>
                          setContent((p) =>
                            p
                              ? {
                                  ...p,
                                  hero: {
                                    ...p.hero,
                                    images: p.hero.images.filter((_, j) => j !== i),
                                  },
                                }
                              : null
                          )
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">Or edit URLs directly (one per line):</div>
          <textarea
            value={content.hero.images.join('\n')}
            onChange={(e) => setContent((p) => p && { ...p, hero: { ...p.hero, images: e.target.value.split('\n').filter(Boolean) } })}
            placeholder="One URL per line"
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[60px] resize-y text-sm"
            rows={2}
          />
        </div>
        <SaveButton saving={saving === 'hero'} onSave={() => handleSave('hero', content.hero)} />
      </Section>

      {/* Work */}
      <Section
        id="work"
        icon={<Briefcase className="w-4 h-4" />}
        title="Work"
        expanded={expanded.work}
        onToggle={() => toggleSection('work')}
      >
        <SectionField label="Clients label" value={content.work.clientsLabel} onChange={(v) => setContent((p) => p && { ...p, work: { ...p.work, clientsLabel: v } })} />
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Client logos (marquee)</label>
          <p className="text-gray-500 text-xs mb-2">Bulk upload logos to add. Remove any you don&apos;t want.</p>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <ImageUpload folder="logos/clients" mode="bulk" accept="image/*" label="Bulk upload logos" onUpload={(urls) => setContent((p) => {
              if (!p) return p;
              const newClients = urls.map((url) => ({ type: 'logo' as const, src: url, alt: url.split('/').pop()?.replace(/\.[^.]+$/, '') || 'Client' }));
              return { ...p, work: { ...p.work, clients: [...p.work.clients, ...newClients] } };
            })} />
          </div>
          {content.work.clients.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-2">Current clients — click remove to delete:</p>
              <div className="flex flex-wrap gap-2">
                {content.work.clients.map((client, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 group"
                  >
                    {client.type === 'logo' ? (
                      <img src={client.src} alt={client.alt} className="h-6 w-auto max-w-[80px] object-contain" />
                    ) : (
                      <span className="text-sm text-gray-400">{client.value}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setContent((p) => p && { ...p, work: { ...p.work, clients: p.work.clients.filter((_, j) => j !== i) } })}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <SaveButton saving={saving === 'work'} onSave={() => handleSave('work', content.work)} />
      </Section>

      {/* Services */}
      <Section
        id="services"
        icon={<FileText className="w-4 h-4" />}
        title="Services"
        expanded={expanded.services}
        onToggle={() => toggleSection('services')}
      >
        <SectionField label="Section title" value={content.services.sectionTitle} onChange={(v) => setContent((p) => p && { ...p, services: { ...p.services, sectionTitle: v } })} />
        <SectionField label="Section subhead" value={content.services.sectionSubhead} onChange={(v) => setContent((p) => p && { ...p, services: { ...p.services, sectionSubhead: v } })} />
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Service images</label>
          <p className="text-gray-500 text-xs mb-2">Bulk upload (order matches service order below).</p>
          <ImageUpload folder="services" mode="bulk" label="Bulk upload service images" onUpload={(urls) => setContent((p) => {
            if (!p) return p;
            const items = p.services.items.map((item, i) =>
              urls[i] !== undefined ? { ...item, image: urls[i] } : item
            );
            return { ...p, services: { ...p.services, items } };
          })} />
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-xs uppercase tracking-widest text-gray-500">
              Service Items ({content.services.items.length})
            </label>
            <button
              onClick={() => {
                const newService = {
                  id: `service-${Date.now()}`,
                  iconKey: 'monitor',
                  title: 'New Service',
                  description: '',
                  image: '',
                  details: {
                    headline: '',
                    text: '',
                    features: [],
                  },
                };
                setContent((p) =>
                  p
                    ? {
                        ...p,
                        services: {
                          ...p.services,
                          items: [...p.services.items, newService],
                        },
                      }
                    : null
                );
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Service
            </button>
          </div>
          <div className="space-y-3">
            {content.services.items.map((service, index) => (
              <ServiceItemEditor
                key={service.id || index}
                service={service}
                index={index}
                onChange={(updated) => {
                  const items = [...content.services.items];
                  items[index] = updated;
                  setContent((p) =>
                    p
                      ? {
                          ...p,
                          services: {
                            ...p.services,
                            items,
                          },
                        }
                      : null
                  );
                }}
                onDelete={() => {
                  const items = content.services.items.filter((_, i) => i !== index);
                  setContent((p) =>
                    p
                      ? {
                          ...p,
                          services: {
                            ...p.services,
                            items,
                          },
                        }
                      : null
                  );
                }}
              />
            ))}
            {content.services.items.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">
                No services yet. Click "Add New Service" to create one.
              </p>
            )}
          </div>
        </div>
        <SaveButton saving={saving === 'services'} onSave={() => handleSave('services', content.services)} />
      </Section>

      {/* Event Types */}
      <Section
        id="eventTypes"
        icon={<Briefcase className="w-4 h-4" />}
        title="Event Types"
        expanded={expanded.eventTypes}
        onToggle={() => toggleSection('eventTypes')}
      >
        <SectionField
          label="Section title"
          value={content.eventTypes?.sectionTitle ?? ''}
          onChange={(v) =>
            setContent((p) =>
              p ? { ...p, eventTypes: { ...p.eventTypes!, sectionTitle: v } } : null
            )
          }
        />
        <SectionField
          label="Section subhead"
          value={content.eventTypes?.sectionSubhead ?? ''}
          onChange={(v) =>
            setContent((p) =>
              p ? { ...p, eventTypes: { ...p.eventTypes!, sectionSubhead: v } } : null
            )
          }
        />
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-xs uppercase tracking-widest text-gray-500">
              Event Type Items ({content.eventTypes?.items?.length ?? 0})
            </label>
            <button
              onClick={() => {
                const newItem = {
                  id: `event-type-${Date.now()}`,
                  title: 'New Event Type',
                  description: '',
                  image: '',
                };
                setContent((p) =>
                  p
                    ? {
                        ...p,
                        eventTypes: {
                          ...p.eventTypes!,
                          items: [...(p.eventTypes?.items ?? []), newItem],
                        },
                      }
                    : null
                );
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Event Type
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">Drag the grip handle to reorder event types.</p>
          <div className="space-y-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleEventTypesDragEnd}
            >
              <SortableContext
                items={(content.eventTypes?.items ?? []).map((item, i) => item.id || `et-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                {(content.eventTypes?.items ?? []).map((eventType, index) => (
                  <SortableEventTypeItem
                    key={eventType.id || `et-${index}`}
                    eventType={eventType}
                    index={index}
                    sortableId={eventType.id || `et-${index}`}
                    onChange={(updated) => {
                      const items = [...(content.eventTypes?.items ?? [])];
                      items[index] = updated;
                      setContent((p) =>
                        p
                          ? {
                              ...p,
                              eventTypes: { ...p.eventTypes!, items },
                            }
                          : null
                      );
                    }}
                    onDelete={() => {
                      const items = (content.eventTypes?.items ?? []).filter(
                        (_, i) => i !== index
                      );
                      setContent((p) =>
                        p
                          ? {
                              ...p,
                              eventTypes: { ...p.eventTypes!, items },
                            }
                          : null
                      );
                    }}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {(content.eventTypes?.items?.length ?? 0) === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">
                No event types yet. Click &quot;Add New Event Type&quot; to create one.
              </p>
            )}
          </div>
        </div>
        <SaveButton
          saving={saving === 'eventTypes'}
          onSave={() => handleSave('eventTypes', content.eventTypes!)}
        />
      </Section>

      {/* Contact */}
      <Section
        id="contact"
        icon={<Mail className="w-4 h-4" />}
        title="Contact"
        expanded={expanded.contact}
        onToggle={() => toggleSection('contact')}
      >
        <SectionField label="Headline" value={content.contact.headline} onChange={(v) => setContent((p) => p && { ...p, contact: { ...p.contact, headline: v } })} textarea />
        <SectionField label="Subhead" value={content.contact.subhead} onChange={(v) => setContent((p) => p && { ...p, contact: { ...p.contact, subhead: v } })} textarea />
        <SectionField label="Email" value={content.contact.email} onChange={(v) => setContent((p) => p && { ...p, contact: { ...p.contact, email: v } })} />
        <SectionField label="Phone" value={content.contact.phone} onChange={(v) => setContent((p) => p && { ...p, contact: { ...p.contact, phone: v } })} />
        <SectionField label="Address" value={content.contact.address} onChange={(v) => setContent((p) => p && { ...p, contact: { ...p.contact, address: v } })} />
        <SectionField label="CTA text" value={content.contact.ctaText} onChange={(v) => setContent((p) => p && { ...p, contact: { ...p.contact, ctaText: v } })} />
        <SectionField label="Copyright" value={content.contact.copyright} onChange={(v) => setContent((p) => p && { ...p, contact: { ...p.contact, copyright: v } })} />
        <div className="mt-4">
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Footer links (JSON)</label>
          <textarea
            value={JSON.stringify(content.contact.footerLinks, null, 2)}
            onChange={(e) => {
              try {
                const footerLinks = JSON.parse(e.target.value);
                setContent((p) => p && { ...p, contact: { ...p.contact, footerLinks } });
              } catch {}
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm min-h-[80px] focus:outline-none focus:border-blue-500"
          />
          <p className="text-gray-500 text-xs mt-1">Array of {`{ label, href }`} objects.</p>
        </div>
        <SaveButton saving={saving === 'contact'} onSave={() => handleSave('contact', content.contact)} />
      </Section>
    </div>
  );
}

function Section({
  id,
  icon,
  title,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-white/10 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 text-left"
      >
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        <span className="text-gray-400">{icon}</span>
        <span className="font-display font-medium text-white">{title}</span>
      </button>
      {expanded && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

function SectionField({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500';

  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} min-h-[80px] resize-y`}
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  );
}

function SaveButton({ saving, onSave }: { saving: boolean; onSave: () => void }) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {saving ? 'Saving...' : 'Save'}
    </button>
  );
}
