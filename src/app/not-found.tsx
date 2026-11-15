import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Calendar } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-canvas">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-8xl font-light tracking-tighter text-border">
          404
        </div>

        <div className="space-y-2">
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Page not found
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            The page or document you requested does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-ink hover:bg-black text-white px-6 py-3 rounded-pill text-xs sm:text-sm font-medium shadow-card transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-surface hover:bg-canvas border border-border text-ink px-6 py-3 rounded-pill text-xs sm:text-sm font-medium shadow-soft transition-all"
          >
            <Calendar className="w-4 h-4 text-accent" />
            <span>Book a Visit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
