import { mkdirSync } from 'fs';
import { join } from 'path';

function parseCookies(req) {
  const cookieHeader = req.headers?.cookie || '';
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce((acc, part) => {
    const [rawKey, ...rest] = part.trim().split('=');
    if (!rawKey || rest.length === 0) return acc;
    acc[rawKey] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

export function slugify(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ensureUploadDir(subFolder) {
  const target = join(process.cwd(), 'public', 'uploads', subFolder);
  mkdirSync(target, { recursive: true });
  return target;
}

export function isAuthorized(req) {
  const cookies = parseCookies(req);
  const cookieToken = cookies.admin_token;
  const headerToken = req.headers['admin-token'];
  const token = cookieToken || headerToken;
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return false;
  }
  return token === expected;
}
