import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-brand-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-lg font-bold">CheapHouseHub</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              America&apos;s #1 marketplace for affordable homes. Foreclosures, auctions, tax liens &amp; bank-owned properties across all 50 states.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="font-semibold text-white mb-4">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search?type=foreclosure" className="text-gray-400 hover:text-white transition-colors">Foreclosures</Link></li>
              <li><Link href="/search?type=auction" className="text-gray-400 hover:text-white transition-colors">Auctions</Link></li>
              <li><Link href="/search?type=tax-lien" className="text-gray-400 hover:text-white transition-colors">Tax Liens</Link></li>
              <li><Link href="/search?type=bank-owned" className="text-gray-400 hover:text-white transition-colors">Bank Owned</Link></li>
              <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors">All Listings</Link></li>
            </ul>
          </div>

          {/* Top States */}
          <div>
            <h4 className="font-semibold text-white mb-4">Top States</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search?state=FL" className="text-gray-400 hover:text-white transition-colors">Florida</Link></li>
              <li><Link href="/search?state=TX" className="text-gray-400 hover:text-white transition-colors">Texas</Link></li>
              <li><Link href="/search?state=CA" className="text-gray-400 hover:text-white transition-colors">California</Link></li>
              <li><Link href="/search?state=OH" className="text-gray-400 hover:text-white transition-colors">Ohio</Link></li>
              <li><Link href="/search?state=GA" className="text-gray-400 hover:text-white transition-colors">Georgia</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/about#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="mailto:support@cheaphousehub.com" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} CheapHouseHub. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Powered by <a href="https://cityscraper.org" className="text-blue-400 hover:text-blue-300">CityScraper</a></p>
        </div>
      </div>
    </footer>
  );
}
