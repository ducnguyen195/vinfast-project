// API Configuration - uses environment variable for dev/prod
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000';
  return `${baseUrl}/${path}`;
};

export default API_URL;
