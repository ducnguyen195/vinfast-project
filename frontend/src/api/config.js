// API configuration for Next.js API routes
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  return `${baseUrl}/${path}`;
};

export default API_URL;
