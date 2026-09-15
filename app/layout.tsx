import type { Metadata } from 'next';
import { ToastProvider } from '@/components/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Genu Library — Digital Guild Sanctuary',
  description: 'Explore rare manuscripts, classical literature, and technical grimoires curated by a global fellowship of scholars.',
  icons: { icon: '/favicon.ico' },
  other: { 'theme-color': '#16110f' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark" lang="en">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="bg-canvas text-text-primary font-body antialiased selection:bg-primary selection:text-canvas">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
