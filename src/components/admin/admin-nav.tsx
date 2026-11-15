'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Inbox,
  Settings,
  Clock,
  Sparkles,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Search,
  LogOut,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const adminLinks = [
  { href: '/admin/appointments', label: 'Inbox', icon: Inbox },
  { href: '/admin/settings', label: 'Clinic Info', icon: Settings },
  { href: '/admin/hours', label: 'Hours & Notice', icon: Clock },
  { href: '/admin/services', label: 'Services', icon: Sparkles },
  { href: '/admin/doctors', label: 'Doctors', icon: Users },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/testimonials', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/seo', label: 'Local SEO', icon: Search },
];

export function AdminNav({ clinicName = 'Clinic Admin' }: { clinicName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/admin/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-surface border-r border-border flex-col justify-between p-4 min-h-screen">
        <div className="space-y-6">
          <div className="px-3 py-2">
            <div className="text-[10px] uppercase font-bold tracking-widest text-accent mb-1">
              Clinic Management
            </div>
            <h2 className="font-editorial text-lg font-bold text-ink truncate">
              {clinicName}
            </h2>
          </div>

          <nav className="space-y-1">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-accent text-white font-semibold shadow-soft'
                      : 'text-ink-muted hover:text-ink hover:bg-canvas'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-border">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
          >
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-accent">
            Admin Console
          </div>
          <div className="font-editorial text-base font-bold text-ink">
            {clinicName}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg bg-canvas text-ink-muted hover:text-ink text-xs"
            title="View Live Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg bg-red-50 text-red-600 text-xs"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Scrollable Horizontal Navigation Bar */}
      <div className="lg:hidden sticky top-[57px] z-30 bg-surface border-b border-border overflow-x-auto hide-scrollbar px-3 py-2 flex items-center space-x-2">
        {adminLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-accent text-white font-semibold'
                  : 'bg-canvas text-ink-muted hover:text-ink border border-border'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
