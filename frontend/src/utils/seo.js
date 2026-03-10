const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vinfasthathanh.com';

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function getSiteUrl() {
  return SITE_URL;
}
