'use client';

import React, { useState } from 'react';
import { SeoPage } from '@/types/clinic';
import { updateSeoPage } from '@/lib/actions/seo';
import { Search, Save, CheckCircle2, Globe, ExternalLink } from 'lucide-react';

interface SeoManagerProps {
  initialPages: SeoPage[];
}

export function SeoManager({ initialPages }: SeoManagerProps) {
  const [pages, setPages] = useState<SeoPage[]>(initialPages);
  const [selectedKey, setSelectedKey] = useState<string>(
    initialPages[0]?.page_key || 'home'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentPage = pages.find((p) => p.page_key === selectedKey) || pages[0];

  const handleFieldChange = (field: keyof SeoPage, value: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.page_key === selectedKey ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPage) return;
    setIsSaving(true);
    setFeedback(null);

    const res = await updateSeoPage(currentPage.id, {
      meta_title: currentPage.meta_title,
      meta_description: currentPage.meta_description,
      og_title: currentPage.og_title,
      og_description: currentPage.og_description,
      og_image_url: currentPage.og_image_url,
    });

    if (res.success) {
      setFeedback(`SEO metadata for "${currentPage.page_key}" saved successfully.`);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2">
        {pages.map((p) => (
          <button
            key={p.page_key}
            onClick={() => {
              setSelectedKey(p.page_key);
              setFeedback(null);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              p.page_key === selectedKey
                ? 'bg-ink text-white shadow-soft'
                : 'bg-surface text-ink-muted border border-border hover:bg-canvas'
            }`}
          >
            /{p.page_key === 'home' ? '' : p.page_key}
          </button>
        ))}
      </div>

      {currentPage && (
        <form
          onSubmit={handleSave}
          className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-accent" />
              <h3 className="font-editorial text-lg font-bold text-ink">
                Editing SEO for /{currentPage.page_key}
              </h3>
            </div>
            <span className="text-xs text-ink-muted">Google & Social tags</span>
          </div>

          {/* Meta Title */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-wider text-ink">
                Google Search Title (&lt;title&gt;)
              </label>
              <span className="text-ink-muted font-mono text-[11px]">
                {currentPage.meta_title.length} / 60 chars
              </span>
            </div>
            <input
              type="text"
              required
              value={currentPage.meta_title}
              onChange={(e) => handleFieldChange('meta_title', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-wider text-ink">
                Google Search Description (Meta Snippet)
              </label>
              <span className="text-ink-muted font-mono text-[11px]">
                {currentPage.meta_description.length} / 160 chars
              </span>
            </div>
            <textarea
              required
              rows={3}
              value={currentPage.meta_description}
              onChange={(e) =>
                handleFieldChange('meta_description', e.target.value)
              }
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
            />
          </div>

          {/* Open Graph Title & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink">
                Social Share Title (WhatsApp / Facebook)
              </label>
              <input
                type="text"
                value={currentPage.og_title || ''}
                onChange={(e) => handleFieldChange('og_title', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink">
                Social Share Image URL (og:image)
              </label>
              <input
                type="text"
                value={currentPage.og_image_url || ''}
                onChange={(e) =>
                  handleFieldChange('og_image_url', e.target.value)
                }
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>
          </div>

          {/* Google Search Result Live Preview Card */}
          <div className="p-4 rounded-2xl bg-canvas border border-border space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-ink-muted mb-2">
              Google Mobile Snippet Preview:
            </div>
            <div className="text-xs text-[#202124] flex items-center space-x-1">
              <span>https://vrikshamclinic.in</span>
              <span>› {currentPage.page_key}</span>
            </div>
            <div className="text-sm font-medium text-[#1a0dab] line-clamp-1">
              {currentPage.meta_title}
            </div>
            <div className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
              {currentPage.meta_description}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center space-x-2 bg-ink hover:bg-black text-white px-6 py-3 rounded-pill text-xs font-semibold shadow-soft transition-all disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Updating...' : 'Save Page SEO'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
