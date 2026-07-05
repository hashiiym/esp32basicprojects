import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Community Projects Showcase',
  description: 'A sleek developer-focused showcase for community projects powered by Google Sheets.'
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white antialiased">{children}</body>
    </html>
  );
}
