import { mkdirSync } from 'fs';
import { join } from 'path';

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
  const token = req.headers['admin-token'];
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return false;
  }
  return token === expected;
}
