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

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return encodeImageUrl(path);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  const cleanPath = String(path).replace(/^\/+/, '');
  return encodeImageUrl(`${baseUrl}/${cleanPath}`);
};

export default API_URL;
