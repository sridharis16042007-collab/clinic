'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/types/clinic';
import {
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from '@/lib/actions/gallery';
import { compressImageToWebP } from '@/lib/utils/image-compression';
import {
  Upload,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';

interface GalleryManagerProps {
  initialImages: GalleryImage[];
}

export function GalleryManager({ initialImages }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('clinic');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // In-browser client-side WebP compression (< 250KB)
      const compressed = await compressImageToWebP(file, 1400, 1000, 0.8);
      setPreviewUrl(compressed.dataUrl);
      setIsUploading(false);
    } catch {
      alert('Could not process image. Please try another file.');
      setIsUploading(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !title) return;

    const newImgData: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'> = {
      title: title || 'Clinic Tour Photo',
      caption: caption || null,
      image_url:
        previewUrl ||
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
      category,
      is_before_after: false,
      before_image_url: null,
      display_order: images.length + 1,
      is_active: true,
    };

    await addGalleryImage(newImgData);
    setImages((prev) => [
      ...prev,
      {
        ...newImgData,
        id: `img-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    setFeedback('Image added to public gallery.');
    setTitle('');
    setCaption('');
    setPreviewUrl(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this gallery photo?')) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      await deleteGalleryImage(id);
      setFeedback('Photo removed.');
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, is_active: !current } : img))
    );
    await updateGalleryImage(id, { is_active: !current });
  };

  return (
    <div className="space-y-8">
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Upload Box with Client-Side Auto Compression */}
      <form
        onSubmit={handleAddImage}
        className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4"
      >
        <h2 className="text-sm uppercase tracking-wider font-bold text-ink">
          Upload New Clinic Photo (Auto-compressed to WebP)
        </h2>
        <p className="text-xs text-ink-muted">
          Staff can take photos on mobile phones. Images are automatically compressed to under 250KB before upload for fast loading across slow mobile networks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
          <div className="sm:col-span-5">
            <label className="border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent transition-colors bg-canvas min-h-[160px]">
              {previewUrl ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="space-y-2 text-ink-muted">
                  <Upload className="w-6 h-6 mx-auto text-accent" />
                  <div className="text-xs font-semibold text-ink">
                    {isUploading ? 'Compressing...' : 'Tap to select photo'}
                  </div>
                  <div className="text-[10px] text-ink-muted">
                    JPG, PNG, HEIC up to 15MB
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <div className="sm:col-span-7 space-y-3">
            <div>
              <label className="text-[11px] uppercase font-bold text-ink">
                Photo Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sterilization Chamber UV Unit"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-ink">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs text-ink focus:outline-none"
              >
                <option value="clinic">Operatory & Treatment Rooms</option>
                <option value="sterilization">Sterilization Protocols</option>
                <option value="equipment">Digital Diagnostics & Equipment</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-ink">
                Caption (Optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Brief note for the lightbox preview..."
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={!title}
                className="inline-flex items-center space-x-1.5 bg-ink hover:bg-black text-white px-5 py-2.5 rounded-pill text-xs font-semibold shadow-soft transition-all disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Save to Gallery</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Existing Gallery Images Grid */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4">
        <h2 className="text-sm uppercase tracking-wider font-bold text-ink">
          Published Photos ({images.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`rounded-2xl border border-border overflow-hidden bg-canvas p-3 space-y-2 transition-opacity ${
                !img.is_active ? 'opacity-50' : ''
              }`}
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#e0e0dc]">
                <Image
                  src={img.image_url}
                  alt={img.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <div className="text-xs font-bold text-ink truncate">
                  {img.title}
                </div>
                <div className="text-[10px] text-accent font-semibold uppercase">
                  {img.category}
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <button
                  onClick={() => handleToggle(img.id, img.is_active)}
                  className="text-xs text-ink-muted hover:text-ink flex items-center space-x-1"
                >
                  {img.is_active ? (
                    <Eye className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-ink-muted" />
                  )}
                  <span>{img.is_active ? 'Active' : 'Hidden'}</span>
                </button>

                <button
                  onClick={() => handleDelete(img.id)}
                  className="text-xs text-red-600 hover:text-red-800 p-1 rounded"
                  title="Delete image"
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
