export function formatTokens(n: number): string {
  if (n < 1000) return n.toString();
  const tiers = [
    [1e15, 'Q'], [1e12, 'T'], [1e9, 'B'], [1e6, 'M'], [1e3, 'K'],
  ] as const;
  for (const [val, suffix] of tiers) {
    if (n >= val) return (n / val).toFixed(1).replace(/\.0$/, '') + suffix;
  }
  return n.toString();
}

export function abbreviateCount(n: number): string {
  return formatTokens(n);
}

export function formatPrice(price: number): string {
  return formatTokens(price);
}

export function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
