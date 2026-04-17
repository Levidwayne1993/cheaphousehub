'use client';

import Link from 'next/link';
import { useState } from 'react';

const FAQS = [
  { q: 'Is CheapHouseHub free to use?', a: 'Yes! Browsing and searching listings on CheapHouseHub is completely free. We aggregate publicly available data from government sources, auction sites, and listing services to bring you the best deals in one place.' },
  { q: 'How often are listings updated?', a: 'Our automated system (powered by CityScraper) refreshes all listings every 4 hours. This means you always see the most current properties available.' },
  { q: 'Are these real properties I can buy?', a: 'Yes. Every listing links back to the original source where you can view full details, contact the seller or auctioneer, and begin the purchasing process. We aggregate the data — the transactions happen through the original platforms.' },
  { q: 'What does "savings percentage" mean?', a: 'The savings percentage shows how much below the estimated market value or original listing price the property is currently priced. For example, a home listed at $80,000 with an original value of $200,000 shows a 60% savings.' },
  { q: 'Do you cover all 50 states?', a: 'We are actively expanding to cover all 50 states. Our current coverage includes major metropolitan areas and is growing every week as we add new data sources.' },
  { q: 'Can I get alerts for new listings?', a: 'Price alerts and saved search notifications are coming soon! For now, we recommend checking back regularly as new properties are added every 4 hours.' },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="hero-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">About CheapHouseHub</h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            We believe everyone deserves access to affordable housing. Our mission is to aggregate the best deals from across America into one easy-to-search platform.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How CheapHouseHub Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We do the hard work of finding deals so you do not have to.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '🤖', title: 'Automated Collection', desc: 'Our engine scans government databases, auction sites, bank REO listings, and tax lien records across all 50 states.' },
              { step: '2', icon: '🔍', title: 'Data Verification', desc: 'Each listing is validated, deduplicated, and enriched with pricing comparisons to calculate real savings.' },
              { step: '3', icon: '📊', title: 'Smart Organization', desc: 'Properties are categorized by type, state, price, and savings — making it easy to find exactly what you need.' },
              { step: '4', icon: '🔄', title: 'Constant Updates', desc: 'New listings are added and stale ones removed every 4 hours, so you always have fresh, accurate data.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-brand-500 font-bold text-sm mb-1">STEP {item.step}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose CheapHouseHub</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: 'Biggest Savings', desc: 'Properties priced up to 60% below market value. We focus exclusively on the most affordable deals.' },
              { icon: '🏛️', title: 'Verified Sources', desc: 'Data sourced from HUD, county records, FDIC, and authorized auction platforms for reliability.' },
              { icon: '⚡', title: 'Real-Time Data', desc: 'Listings refreshed every 4 hours. No stale data or expired listings cluttering your search.' },
              { icon: '🗺️', title: 'Nationwide Coverage', desc: 'Expanding across all 50 states. From rural farmhouses to urban condos — we cover it all.' },
              { icon: '🔓', title: 'Completely Free', desc: 'No subscriptions, no paywalls, no hidden fees. Browse every listing at zero cost to you.' },
              { icon: '📱', title: 'Mobile Ready', desc: 'Fully responsive design works beautifully on any device. Search homes from anywhere.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{feat.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Data Sources</h2>
            <p className="text-gray-500">We aggregate from trusted, verified platforms.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'HUD HomeStore', 'RealtyMole API', 'RentCast API',
              'County Tax Records', 'Auction.com', 'Bank REO Listings',
            ].map((source, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                <span className="text-sm font-medium text-gray-700">{source}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left"
                >
                  <span className="font-semibold text-gray-800">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`px-6 text-gray-600 text-sm leading-relaxed transition-all ${openFaq === i ? 'pb-4' : 'h-0 overflow-hidden'}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Finding Affordable Homes</h2>
          <p className="text-blue-200 text-lg mb-8">Thousands of deals waiting for you. Search now — it is free.</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Search Homes Now
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
