// src/app/layout.tsx
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 0.5,
  maximumScale: 3,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${ibmPlexMono.variable}`}
    >
      <head></head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
