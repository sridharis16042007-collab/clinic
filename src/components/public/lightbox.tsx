'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/types/clinic';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface LightboxGalleryProps {
  images: GalleryImage[];
}

export function LightboxGallery({ images }: LightboxGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { key: 'all', label: 'All Spaces' },
    { key: 'clinic', label: 'Operatory & Rooms' },
    { key: 'sterilization', label: 'Sterilization Unit' },
    { key: 'equipment', label: 'Digital Equipment' },
  ];

  const filteredImages =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  }, [lightboxIndex, filteredImages.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
      );
    }
  }, [lightboxIndex, filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, showNext, showPrev]);

  const currentLightboxImage =
    lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat.key
                ? 'bg-ink text-white shadow-soft'
                : 'bg-surface text-ink-muted border border-border hover:bg-canvas'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredImages.map((img, index) => (
          <div
            key={img.id}
            onClick={() => openLightbox(index)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-surface border border-border shadow-soft hover:shadow-card transition-all duration-300"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8e8e3]">
              <Image
                src={img.image_url}
                alt={img.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-3 rounded-full bg-white/90 text-ink shadow-card">
                  <Eye className="w-4 h-4 text-accent" />
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                {img.title}
              </h3>
              {img.caption && (
                <p className="text-xs text-ink-muted mt-1 line-clamp-2">
                  {img.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {currentLightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            aria-label="Close Lightbox"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={showPrev}
            aria-label="Previous Image"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={showNext}
            aria-label="Next Image"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <div className="relative w-full h-[60vh] sm:h-[70vh]">
              <Image
                src={currentLightboxImage.image_url}
                alt={currentLightboxImage.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="mt-4 text-center text-white max-w-xl">
              <div className="text-base font-semibold">
                {currentLightboxImage.title}
              </div>
              {currentLightboxImage.caption && (
                <p className="text-xs text-[#a0a09b] mt-1">
                  {currentLightboxImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
