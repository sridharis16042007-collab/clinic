'use client';

import React, { useState } from 'react';
import { Service } from '@/types/clinic';
import {
  createService,
  updateService,
  deleteService,
} from '@/lib/actions/services';
import { formatINR } from '@/lib/utils/formatters';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ServicesManagerProps {
  initialServices: Service[];
}

export function ServicesManager({ initialServices }: ServicesManagerProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    title_ta: '',
    slug: '',
    short_description: '',
    full_description: '',
    starting_price: 1000,
    duration_minutes: 30,
    badge: '',
    image_url: '',
    is_active: true,
  });

  const handleEditClick = (srv: Service) => {
    setEditingService(srv);
    setFormData(srv);
    setIsCreating(false);
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setEditingService(null);
    setFormData({
      title: '',
      title_ta: '',
      slug: `service-${Date.now()}`,
      short_description: '',
      full_description: '',
      starting_price: 1000,
      duration_minutes: 30,
      badge: '',
      image_url:
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=900&auto=format&fit=crop',
      is_active: true,
      display_order: services.length + 1,
    });
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s))
    );
    await updateService(id, { is_active: !current });
    setFeedback(`Service ${!current ? 'activated' : 'hidden'}.`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this clinical service?')) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      await deleteService(id);
      setFeedback('Service deleted.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreating) {
      const slugVal =
        formData.slug ||
        (formData.title || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newSrv = {
        ...formData,
        slug: slugVal,
      } as Service;

      await createService(newSrv);
      setServices((prev) => [...prev, newSrv]);
      setFeedback('New service added successfully.');
      setIsCreating(false);
    } else if (editingService) {
      await updateService(editingService.id, formData);
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id ? ({ ...s, ...formData } as Service) : s
        )
      );
      setFeedback('Service updated successfully.');
      setEditingService(null);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-xs text-ink-muted">
          Showing {services.length} treatments
        </div>
        {!isCreating && !editingService && (
          <button
            onClick={handleCreateClick}
            className="inline-flex items-center space-x-1.5 bg-ink hover:bg-black text-white px-4 py-2 rounded-pill text-xs font-semibold shadow-soft transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Service</span>
          </button>
        )}
      </div>

      {/* Create / Edit Form Modal or Panel */}
      {(isCreating || editingService) && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-4 animate-in fade-in"
        >
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <h3 className="font-editorial text-lg font-bold text-ink">
              {isCreating ? 'Add New Clinical Service' : `Edit: ${editingService?.title}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingService(null);
              }}
              className="text-xs text-ink-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Service Title (English) *
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Laser Root Canal Therapy"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Title (Tamil - தமிழ்)
              </label>
              <input
                type="text"
                value={formData.title_ta || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title_ta: e.target.value }))
                }
                placeholder="எ.கா. நவீன லேசர் வேர் சிகிச்சை"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-bold text-ink">
              Short Summary Description *
            </label>
            <textarea
              required
              rows={2}
              value={formData.short_description || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  short_description: e.target.value,
                }))
              }
              placeholder="Short clinical summary for card and gallery preview..."
              className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-bold text-ink">
              Full Clinical Details
            </label>
            <textarea
              rows={3}
              value={formData.full_description || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  full_description: e.target.value,
                }))
              }
              placeholder="Detailed treatment procedure, anesthesia information, post-op expectations..."
              className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Starting Fee (₹ INR)
              </label>
              <input
                type="number"
                value={formData.starting_price || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    starting_price: Number(e.target.value),
                  }))
                }
                placeholder="2500"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration_minutes || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration_minutes: Number(e.target.value),
                  }))
                }
                placeholder="45"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Badge / Tag
              </label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, badge: e.target.value }))
                }
                placeholder="e.g. Pain Relief, Aesthetic"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-bold text-ink">
              Image URL
            </label>
            <input
              type="text"
              value={formData.image_url || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image_url: e.target.value }))
              }
              placeholder="https://..."
              className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingService(null);
              }}
              className="px-4 py-2 rounded-pill bg-canvas text-xs font-semibold text-ink-muted border border-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-pill bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-soft"
            >
              {isCreating ? 'Save Service' : 'Update Service'}
            </button>
          </div>
        </form>
      )}

      {/* Services List Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-soft">
        <div className="divide-y divide-border">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                !srv.is_active ? 'opacity-50 bg-canvas/40' : 'hover:bg-canvas/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-xs font-mono font-bold text-ink-muted mt-0.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-ink">
                      {srv.title}
                    </span>
                    {srv.badge && (
                      <span className="text-[10px] font-semibold text-accent bg-accent-light px-2 py-0.5 rounded-full">
                        {srv.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-1 mt-0.5 max-w-lg">
                    {srv.short_description}
                  </p>
                  <div className="flex items-center space-x-4 text-[11px] text-ink-muted mt-2">
                    {srv.starting_price && (
                      <span className="flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-accent" />
                        <span>From {formatINR(srv.starting_price)}</span>
                      </span>
                    )}
                    {srv.duration_minutes && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>~{srv.duration_minutes} mins</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  onClick={() => handleToggleActive(srv.id, srv.is_active)}
                  className="p-2 rounded-lg bg-canvas text-ink-muted hover:text-ink border border-border"
                  title={srv.is_active ? 'Hide from public site' : 'Show on public site'}
                >
                  {srv.is_active ? (
                    <Eye className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-ink-muted" />
                  )}
                </button>
                <button
                  onClick={() => handleEditClick(srv)}
                  className="p-2 rounded-lg bg-canvas text-ink-muted hover:text-ink border border-border"
                  title="Edit details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id)}
                  className="p-2 rounded-lg bg-canvas text-ink-muted hover:text-red-600 border border-border"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
