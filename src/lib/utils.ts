// ============================================================
//  CHEAPHOUSEHUB.COM — UTILITY FUNCTIONS
// ============================================================

export function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `$${(price / 1_000_000).toFixed(1)}M`;
  }
  if (price >= 1_000) {
    return `$${(price / 1_000).toFixed(0)}K`;
  }
  return `$${price.toLocaleString()}`;
}

export function formatPriceFull(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatSqft(sqft: number | null): string {
  if (!sqft) return '--';
  return `${formatNumber(sqft)} sqft`;
}

export function calcSavings(price: number, originalPrice: number | null): { amount: number; percent: number } | null {
  if (!originalPrice || originalPrice <= price) return null;
  const amount = originalPrice - price;
  const percent = Math.round((amount / originalPrice) * 100);
  return { amount, percent };
}

export function getPlaceholderImage(index: number = 0): string {
  const colors = ['4F46E5', '2563EB', '0891B2', '059669', '7C3AED', 'DC2626'];
  const color = colors[index % colors.length];
  return `https://placehold.co/800x600/${color}/FFFFFF?text=Property+Photo`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function timeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
