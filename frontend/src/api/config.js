// API configuration for Next.js API routes
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const encodeImageUrl = (value) => {
  if (!value) return value;
  try {
    return encodeURI(String(value));
  } catch {
    return value;
  }
};

const getConfiguredApiOrigin = () => {
  const explicitOrigin = process.env.NEXT_PUBLIC_API_ORIGIN || process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
  if (explicitOrigin) {
    return String(explicitOrigin).replace(/\/+$/, '');
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (!apiUrl) return '';

  const normalizedApiUrl = String(apiUrl).replace(/\/+$/, '');
  if (normalizedApiUrl.startsWith('http://') || normalizedApiUrl.startsWith('https://')) {
    return normalizedApiUrl.replace(/\/api$/, '');
  }

  return '';
};

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return encodeImageUrl(path);
  const baseUrl = getConfiguredApiOrigin();
  const cleanPath = String(path).replace(/^\/+/, '');
  return encodeImageUrl(`${baseUrl}/${cleanPath}`);
};

export default API_URL;
