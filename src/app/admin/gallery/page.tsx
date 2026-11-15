import React from 'react';
import { GalleryManager } from '@/components/admin/gallery-manager';
import { getActiveGallery } from '@/lib/data';
import { Image as ImageIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const images = await getActiveGallery();

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Visual Media</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
          Clinic Photo Gallery
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Upload and manage photos of clinic operatory, sterilization suite, and diagnostic equipment with automated client-side WebP compression.
        </p>
      </div>

      <GalleryManager initialImages={images} />
    </div>
  );
}
