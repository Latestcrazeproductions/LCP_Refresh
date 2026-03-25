'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Save,
  Loader2,
  FileText,
  Video,
  Building2,
  Zap,
  Briefcase,
  Mail,
  Trash2,
  GripVertical,
  Plus,
  CalendarDays,
  Edit2,
  HelpCircle,
  Inbox,
  Settings,
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
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createClient } from '@/lib/supabase/client';
import { saveContent } from './actions';
import { ImageUpload } from './ImageUpload';
import { ServiceItemEditor } from './ServiceItemEditor';
import { EventTypeItemEditor } from './EventTypeItemEditor';
import { SubmissionsViewer } from './SubmissionsViewer';
import type { SiteContent, EditableSiteContent } from '@/lib/content';

async function fetchContent(): Promise<SiteContent> {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error('Failed to fetch content');
  return res.json();
}

function getImageLabel(url: string, index: number): string {
  const part = url.split('/').pop() ?? '';
  const filename = part.split('?')[0];
  return filename.length > 30 ? filename.slice(0, 27) + '...' : filename || `Slide ${index + 1}`;
}

// ----------------------------------------------------------------------
// SORTABLE COMPONENTS
// ----------------------------------------------------------------------

function SortableImageCard({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-lg overflow-hidden bg-white/5 border border-white/10 aspect-video">
      <img src={url} alt={getImageLabel(url, index)} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded transition-colors opacity-90 group-hover:opacity-100 z-10"
        title="Remove"
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

function SortableCard({
  id,
  title,
  image,
  onEdit,
}: {
  id: string;
  title: string;
  image: string;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group pb-4 flex flex-col">
      <div className="relative aspect-video bg-black/40">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No Image</div>
        )}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded cursor-grab active:cursor-grabbing z-10"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
      <div className="px-4 pt-4 flex-1 flex flex-col">
        <h3 className="font-display font-medium text-white line-clamp-1 mb-4 flex-1">{title || 'Untitled'}</h3>
        <button
          onClick={onEdit}
          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm transition-colors mt-auto"
        >
          <Edit2 className="w-4 h-4" />
          Edit Details
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN EDITOR COMPONENT
// ----------------------------------------------------------------------

type TabKey = 'brand' | 'hero' | 'featuredVideo' | 'work' | 'services' | 'eventTypes' | 'faq' | 'contact' | 'submissions';

const TABS: { id: TabKey; label: string; icon: React.ElementType }[] = [
  { id: 'brand', label: 'Brand', icon: Building2 },
  { id: 'hero', label: 'Hero Section', icon: Zap },
  { id: 'featuredVideo', label: 'Featured Video', icon: Video },
  { id: 'work', label: 'Work & Clients', icon: Briefcase },
  { id: 'services', label: 'Services', icon: FileText },
  { id: 'eventTypes', label: 'Event Types', icon: CalendarDays },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'contact', label: 'Contact & Footer', icon: Mail },
  { id: 'submissions', label: 'Form Submissions', icon: Inbox },
];

export default function CmsEditor() {
  const [content, setContent] = useState<EditableSiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  
  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState<TabKey>('brand');
  
  // Master-Detail State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingEventTypeId, setEditingEventTypeId] = useState<string | null>(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Drag Handlers
  function handleHeroDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !content) return;
    const oldIndex = content.hero.images.findIndex((url) => url === active.id);
    const newIndex = content.hero.images.findIndex((url) => url === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      setContent((p) => p ? { ...p, hero: { ...p.hero, images: arrayMove(p.hero.images, oldIndex, newIndex) } } : null);
    }
  }

  function handleServicesDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !content) return;
    const items = content.services.items;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      setContent((p) => p ? { ...p, services: { ...p.services, items: arrayMove(items, oldIndex, newIndex) } } : null);
    }
  }

  function handleEventTypesDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !content) return;
    const items = content.eventTypes.items;
    const getId = (item: any, i: number) => item.id || `et-${i}`;
    const oldIndex = items.findIndex((item, i) => getId(item, i) === active.id);
    const newIndex = items.findIndex((item, i) => getId(item, i) === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      setContent((p) => p ? { ...p, eventTypes: { ...p.eventTypes, items: arrayMove(items, oldIndex, newIndex) } } : null);
    }
  }

  // Common UI components for forms
  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500';
  const textareaClass = `${inputClass} min-h-[80px] resize-y`;

  const Field = ({ label, value, onChange, placeholder, type = 'text', rows = 3 }: any) => (
    <div>
      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={textareaClass} rows={rows} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
      )}
    </div>
  );

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  if (!content) return <div className="p-8 text-center text-red-400">Failed to load content.</div>;

  const renderContent = () => {
    switch (activeTab) {
      case 'brand':
        return (
          <div className="space-y-8">
            <Field label="Name" value={content.brand.name} onChange={(v: string) => setContent((p) => p && { ...p, brand: { ...p.brand, name: v } })} />
            <Field label="Full Name" value={content.brand.nameFull} onChange={(v: string) => setContent((p) => p && { ...p, brand: { ...p.brand, nameFull: v } })} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Field label="Logo URL" value={content.brand.logo ?? ''} onChange={(v: string) => setContent((p) => p && { ...p, brand: { ...p.brand, logo: v || null } })} />
                <div className="mt-4"><ImageUpload folder="logos/company" mode="single" label="Upload Logo" onUpload={(url) => setContent((p) => p && { ...p, brand: { ...p.brand, logo: url } })} /></div>
              </div>
              <div>
                <Field label="Logo Dark URL" value={content.brand.logoDark ?? ''} onChange={(v: string) => setContent((p) => p && { ...p, brand: { ...p.brand, logoDark: v || null } })} />
                <div className="mt-4"><ImageUpload folder="logos/company" mode="single" label="Upload Dark Logo" onUpload={(url) => setContent((p) => p && { ...p, brand: { ...p.brand, logoDark: url } })} /></div>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Logo size (navbar height)</label>
              <select
                value={content.brand.logoHeight ?? 64}
                onChange={(e) => setContent((p) => p && { ...p, brand: { ...p.brand, logoHeight: Number(e.target.value) } })}
                className={inputClass + ' max-w-xs block'}
              >
                {[32,40,48,56,64,80,96,112,128,160,200].map(h => <option key={h} value={h}>{h}px</option>)}
              </select>
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className="space-y-8">
            <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(v: string) => setContent((p) => p && { ...p, hero: { ...p.hero, eyebrow: v } })} />
            <Field label="Headline" type="textarea" value={content.hero.headline} onChange={(v: string) => setContent((p) => p && { ...p, hero: { ...p.hero, headline: v } })} />
            <Field label="Subhead" type="textarea" value={content.hero.subhead} onChange={(v: string) => setContent((p) => p && { ...p, hero: { ...p.hero, subhead: v } })} />
            
            <div className="pt-8 border-t border-white/10">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-4">Background Slideshow Images</label>
              <div className="mb-6"><ImageUpload folder="hero" mode="bulk" label="Bulk Upload Backgrounds" onUpload={(urls) => setContent((p) => p && { ...p, hero: { ...p.hero, images: [...p.hero.images, ...urls] } })} /></div>
              
              {content.hero.images.length > 0 && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleHeroDragEnd}>
                  <SortableContext items={content.hero.images} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {content.hero.images.map((url, i) => (
                        <SortableImageCard key={url} url={url} index={i} onRemove={() => setContent((p) => p && { ...p, hero: { ...p.hero, images: p.hero.images.filter((_, j) => j !== i) } })} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        );
      case 'featuredVideo':
        return (
          <div className="space-y-8">
            <Field label="YouTube URL" value={content.featuredVideo?.youtubeUrl ?? ''} onChange={(v: string) => setContent((p) => p && { ...p, featuredVideo: { ...p.featuredVideo!, youtubeUrl: v } })} />
            <p className="text-gray-500 text-sm">Embedded on homepage. Supports watch URLs and youtu.be links. Use &amp;t=30s for start time.</p>
          </div>
        );
      case 'work':
        return (
          <div className="space-y-8">
            <Field label="Clients label" value={content.work.clientsLabel} onChange={(v: string) => setContent((p) => p && { ...p, work: { ...p.work, clientsLabel: v } })} />
            <div className="pt-8 border-t border-white/10">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-4">Client Logos (Marquee)</label>
              <div className="mb-6">
                <ImageUpload folder="logos/clients" mode="bulk" accept="image/*" label="Bulk Upload Logos" onUpload={(urls) => setContent((p) => {
                  if (!p) return p;
                  const newClients = urls.map((url) => ({ type: 'logo' as const, src: url, alt: url.split('/').pop()?.replace(/\.[^.]+$/, '') || 'Client' }));
                  return { ...p, work: { ...p.work, clients: [...p.work.clients, ...newClients] } };
                })} />
              </div>
              <div className="flex flex-wrap gap-4">
                {content.work.clients.map((client, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-4 py-3 group">
                    {client.type === 'logo' ? <img src={client.src} alt={client.alt} className="h-8 w-auto max-w-[100px] object-contain" /> : <span className="text-sm text-gray-400">{client.value}</span>}
                    <button type="button" onClick={() => setContent((p) => p && { ...p, work: { ...p.work, clients: p.work.clients.filter((_, j) => j !== i) } })} className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'services':
        if (editingServiceId) {
          const serviceIndex = content.services.items.findIndex(s => s.id === editingServiceId);
          if (serviceIndex === -1) { setEditingServiceId(null); return null; }
          const service = content.services.items[serviceIndex];
          
          return (
            <ServiceItemEditor
              service={service}
              index={serviceIndex}
              onChange={(updated) => {
                const items = [...content.services.items];
                items[serviceIndex] = updated;
                setContent((p) => p && { ...p, services: { ...p.services, items } });
              }}
              onDelete={() => {
                const items = content.services.items.filter((_, i) => i !== serviceIndex);
                setContent((p) => p && { ...p, services: { ...p.services, items } });
              }}
              onBack={() => setEditingServiceId(null)}
            />
          );
        }
        return (
          <div className="space-y-8">
            <Field label="Section title" value={content.services.sectionTitle} onChange={(v: string) => setContent((p) => p && { ...p, services: { ...p.services, sectionTitle: v } })} />
            <Field label="Section subhead" value={content.services.sectionSubhead} onChange={(v: string) => setContent((p) => p && { ...p, services: { ...p.services, sectionSubhead: v } })} type="textarea" />
            
            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500">Service Elements</label>
                <button
                  onClick={() => {
                    const newId = `service-${Date.now()}`;
                    const newService = { id: newId, iconKey: 'monitor', title: 'New Service', description: '', image: '', details: { headline: '', text: '', features: [] } };
                    setContent((p) => p && { ...p, services: { ...p.services, items: [...p.services.items, newService] } });
                    setEditingServiceId(newId);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New Service
                </button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleServicesDragEnd}>
                <SortableContext items={content.services.items.map(s => s.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.services.items.map((service) => (
                      <SortableCard key={service.id} id={service.id} title={service.title} image={service.image} onEdit={() => setEditingServiceId(service.id)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        );
      case 'eventTypes':
        if (editingEventTypeId) {
          const items = content.eventTypes?.items || [];
          const itId = (i: any, ind: number) => i.id || `et-${ind}`;
          const index = items.findIndex((it, idx) => itId(it, idx) === editingEventTypeId);
          if (index === -1) { setEditingEventTypeId(null); return null; }
          const eventType = items[index];
          
          return (
            <EventTypeItemEditor
              eventType={eventType}
              index={index}
              onChange={(updated) => {
                const newItems = [...items];
                newItems[index] = updated;
                setContent((p) => p && { ...p, eventTypes: { ...p.eventTypes!, items: newItems } });
              }}
              onDelete={() => {
                const newItems = items.filter((_, i) => i !== index);
                setContent((p) => p && { ...p, eventTypes: { ...p.eventTypes!, items: newItems } });
              }}
              onBack={() => setEditingEventTypeId(null)}
            />
          );
        }
        return (
          <div className="space-y-8">
            <Field label="Section title" value={content.eventTypes?.sectionTitle ?? ''} onChange={(v: string) => setContent((p) => p && { ...p, eventTypes: { ...p.eventTypes!, sectionTitle: v } })} />
            <Field label="Section subhead" type="textarea" value={content.eventTypes?.sectionSubhead ?? ''} onChange={(v: string) => setContent((p) => p && { ...p, eventTypes: { ...p.eventTypes!, sectionSubhead: v } })} />
            
            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500">Event Type Elements</label>
                <button
                  onClick={() => {
                    const newId = `event-type-${Date.now()}`;
                    const newItem = { id: newId, title: 'New Event Type', description: '', image: '' };
                    setContent((p) => p && { ...p, eventTypes: { ...p.eventTypes!, items: [...(p.eventTypes?.items || []), newItem] } });
                    setEditingEventTypeId(newId);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Event Type
                </button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEventTypesDragEnd}>
                <SortableContext items={(content.eventTypes?.items || []).map((it, i) => it.id || `et-${i}`)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(content.eventTypes?.items || []).map((et, i) => (
                      <SortableCard key={et.id || `et-${i}`} id={et.id || `et-${i}`} title={et.title} image={et.image} onEdit={() => setEditingEventTypeId(et.id || `et-${i}`)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div className="space-y-8">
            <Field label="Section title" value={content.faq?.sectionTitle ?? ''} onChange={(v: string) => setContent((p) => p && { ...p, faq: { ...p.faq!, sectionTitle: v } })} />
            
            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500">FAQ Items</label>
                <button
                  onClick={() => {
                    const newItem = { question: 'New Question', answer: '' };
                    setContent((p) => p && { ...p, faq: { ...p.faq!, items: [...(p.faq?.items || []), newItem] } });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </div>

              <div className="space-y-6">
                {(content.faq?.items || []).map((faq, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6 relative group">
                    <button
                      onClick={() => {
                        const items = [...(content.faq?.items || [])];
                        items.splice(idx, 1);
                        setContent((p) => p && { ...p, faq: { ...p.faq!, items } });
                      }}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="space-y-4 pr-12">
                      <Field label="Question" value={faq.question} onChange={(v: string) => {
                        const items = [...(content.faq?.items || [])];
                        items[idx] = { ...items[idx], question: v };
                        setContent((p) => p && { ...p, faq: { ...p.faq!, items } });
                      }} />
                      <Field label="Answer" type="textarea" value={faq.answer} onChange={(v: string) => {
                        const items = [...(content.faq?.items || [])];
                        items[idx] = { ...items[idx], answer: v };
                        setContent((p) => p && { ...p, faq: { ...p.faq!, items } });
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Field label="Headline" type="textarea" value={content.contact.headline} onChange={(v: string) => setContent((p) => p && { ...p, contact: { ...p.contact, headline: v } })} />
                <Field label="Subhead" type="textarea" value={content.contact.subhead} onChange={(v: string) => setContent((p) => p && { ...p, contact: { ...p.contact, subhead: v } })} />
                <Field label="Email" value={content.contact.email} onChange={(v: string) => setContent((p) => p && { ...p, contact: { ...p.contact, email: v } })} />
                <Field label="Phone" value={content.contact.phone} onChange={(v: string) => setContent((p) => p && { ...p, contact: { ...p.contact, phone: v } })} />
              </div>
              <div className="space-y-8">
                <Field label="Address" type="textarea" value={content.contact.address} onChange={(v: string) => setContent((p) => p && { ...p, contact: { ...p.contact, address: v } })} />
                <Field label="CTA Request Text" value={content.contact.ctaText} onChange={(v: string) => setContent((p) => p && { ...p, contact: { ...p.contact, ctaText: v } })} />
                <Field label="Copyright Notice" value={content.contact.copyright} onChange={(v: string) => setContent((p) => p && { ...p, contact: { ...p.contact, copyright: v } })} />
                <div>
                  <Field label="Contact Image URL" value={content.contact.image ?? ''} onChange={(v: string) => setContent((p) => p && { ...p, contact: { ...p.contact, image: v || null } })} />
                  <div className="mt-4"><ImageUpload folder="contact" mode="single" label="Upload Contact Image" onUpload={(url) => setContent((p) => p && { ...p, contact: { ...p.contact, image: url } })} /></div>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/10">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Footer Links (JSON)</label>
              <textarea
                value={JSON.stringify(content.contact.footerLinks, null, 2)}
                onChange={(e) => {
                  try {
                    const footerLinks = JSON.parse(e.target.value);
                    setContent((p) => p && { ...p, contact: { ...p.contact, footerLinks } });
                  } catch {}
                }}
                className={`${textareaClass} font-mono text-sm min-h-[160px]`}
              />
            </div>
          </div>
        );
      case 'submissions':
        return <SubmissionsViewer />;
    }
  };

  const activeTabData = TABS.find(t => t.id === activeTab);
  const TabIcon = activeTabData?.icon || FileText;

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-black/40 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-display font-bold text-white tracking-tight">CMS Dashboard</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditingServiceId(null);
                  setEditingEventTypeId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/cms/settings"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Site settings
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Sticky Top Bar */}
        <header className="h-20 px-8 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400">
              <TabIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-display font-semibold text-white">
              {activeTabData?.label} {editingServiceId || editingEventTypeId ? '- Editing' : ''}
            </h2>
          </div>
          
          {activeTab !== 'submissions' && (
            <button
              onClick={() => handleSave(activeTab, content[activeTab])}
              disabled={saving === activeTab}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
            >
              {saving === activeTab ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving === activeTab ? 'Publishing...' : 'Publish Changes'}
            </button>
          )}
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-5xl mx-auto pb-24">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
