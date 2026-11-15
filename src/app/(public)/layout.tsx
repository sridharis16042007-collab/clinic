import React from 'react';
import { Header } from '@/components/public/header';
import { Footer } from '@/components/public/footer';
import { getSiteSettings, getOpeningHours } from '@/lib/data';
import { cleanPhoneForTel } from '@/lib/utils/formatters';
import { Phone, MessageCircle } from 'lucide-react';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, hours] = await Promise.all([
    getSiteSettings(),
    getOpeningHours(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header settings={settings} />
      
      <main id="main-content" className="flex-1 page-fade">
        {children}
      </main>

      <Footer settings={settings} hours={hours} />

      {/* Mobile Sticky Quick-Action Bar (Call + WhatsApp) */}
      <div className="fixed bottom-3 left-4 right-4 z-40 sm:hidden flex items-center gap-2 p-1.5 bg-ink/95 backdrop-blur-md text-white rounded-pill shadow-card border border-white/10 animate-in slide-in-from-bottom duration-300">
        <a
          href={`tel:${cleanPhoneForTel(settings.phone)}`}
          className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-pill bg-white/10 text-xs font-semibold hover:bg-white/20 active:scale-95 transition-all text-white"
        >
          <Phone className="w-3.5 h-3.5 text-accent" />
          <span>Call Clinic</span>
        </a>
        <a
          href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
            settings.clinic_name
          )},%20I%20would%20like%20to%20book%20a%20visit.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-pill bg-accent text-white text-xs font-semibold hover:bg-accent-hover active:scale-95 transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
