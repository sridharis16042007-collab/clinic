import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/lib/data';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-editorial',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vrikshamclinic.in';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.clinic_name} | Rasipuram, Namakkal`,
      template: `%s | ${settings.clinic_name}`,
    },
    description:
      settings.tagline ||
      `Modern, gentle healthcare and dental clinic in Rasipuram, Namakkal, Tamil Nadu. Book appointments via WhatsApp or call.`,
    keywords: [
      `${settings.clinic_name}`,
      'Dentist in Rasipuram',
      'Dental clinic Rasipuram',
      'Root canal treatment Rasipuram',
      'Dental implants Namakkal',
      'Teeth clinic Tamil Nadu',
      'Dental hospital Salem Main Road',
    ],
    authors: [{ name: settings.clinic_name }],
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: siteUrl,
      title: `${settings.clinic_name} | Rasipuram`,
      description: settings.tagline || 'Modern clinical care in Rasipuram.',
      siteName: settings.clinic_name,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const accentColor = settings.accent_color || '#2f8f4e';

  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --accent-color: ${accentColor};
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-canvas text-ink font-sans antialiased selection:bg-accent selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-surface text-ink shadow-card rounded-pill border border-border"
        >
          Skip to main content
        </a>
        <div className="relative flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
