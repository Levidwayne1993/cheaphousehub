import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CheapHouseHub — America\'s #1 Affordable Housing Marketplace',
  description: 'Find foreclosures, bank-owned homes, tax liens, auction properties and budget homes across all 50 states. Save up to 60% below market value.',
  keywords: 'cheap homes, foreclosures, bank owned homes, tax lien properties, auction homes, affordable housing, budget homes, HUD homes',
  openGraph: {
    title: 'CheapHouseHub — Affordable Homes Across America',
    description: 'Foreclosures, auctions, tax liens & bank-owned homes. Save up to 60% below market value.',
    url: 'https://cheaphousehub.com',
    siteName: 'CheapHouseHub',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
