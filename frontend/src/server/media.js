import { readFileSync } from 'fs';
import { basename, extname } from 'path';
import { pool } from './db';
import { slugify } from './utils';

export async function storeUploadedFile(file, options = {}) {
  if (!file?.filepath) {
    return null;
  }

  const fallbackName = options.fallbackName || 'file';
  const originalName = basename(file.originalFilename || fallbackName);
  const extension = extname(originalName).toLowerCase();
  const stem = originalName.slice(0, originalName.length - extension.length);
  const safeStem = slugify(stem) || slugify(fallbackName) || 'file';
  const safeExtension = /^\.[a-z0-9]+$/.test(extension) ? extension : '';
  const fileName = `${safeStem}${safeExtension}`;
  const mimeType = typeof file.mimetype === 'string' && file.mimetype
    ? file.mimetype
    : 'application/octet-stream';
  const purpose = options.purpose ? String(options.purpose).trim() : null;
  const entityType = options.entityType ? String(options.entityType).trim() : null;
  const entityKey = options.entityKey ? String(options.entityKey).trim() : null;
  const content = readFileSync(file.filepath);

  const result = await pool.query(
    `INSERT INTO media_uploads (file_name, mime_type, purpose, entity_type, entity_key, content, byte_size)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [fileName, mimeType, purpose, entityType, entityKey, content, content.length]
  );

  return `/api/media/${result.rows[0].id}`;
}