import { copyFileSync } from 'fs';
import { basename, join } from 'path';
import { ensureSchema, pool } from '../../../src/server/db';
import { parseMultipart } from '../../../src/server/form';
import { ensureUploadDir, isAuthorized, slugify } from '../../../src/server/utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
      return res.status(200).json({ success: true, message: 'Danh sách sản phẩm', data: result.rows });
    }

    if (req.method === 'POST') {
      if (!isAuthorized(req)) {
        return res.status(403).json({ success: false, detail: 'Không có quyền' });
      }

      const { fields, files } = await parseMultipart(req);
      const name = fields.name?.[0] || '';
      const description = fields.description?.[0] || '';
      const price = Number(fields.price?.[0] || 0);
      const content = fields.content?.[0] || '';
      const inputSlug = fields.slug?.[0] || '';
      const finalSlug = inputSlug || slugify(name);

      if (!name || !finalSlug) {
        return res.status(400).json({ success: false, detail: 'Thiếu tên hoặc slug' });
      }

      const exists = await pool.query('SELECT id FROM products WHERE slug = $1 LIMIT 1', [finalSlug]);
      if (exists.rowCount > 0) {
        return res.status(400).json({ success: false, detail: 'Slug đã tồn tại' });
      }

      let imageUrl = null;
      const file = files.file?.[0];
      if (file?.filepath) {
        const uploadDir = ensureUploadDir('products');
        const savedName = `${finalSlug}_${Date.now()}_${basename(file.originalFilename || 'image')}`;
        const target = join(uploadDir, savedName);
        copyFileSync(file.filepath, target);
        imageUrl = `uploads/products/${savedName}`;
      }

      const inserted = await pool.query(
        `INSERT INTO products (name, slug, description, price, image_url, content)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, finalSlug, description, price, imageUrl, content]
      );

      return res.status(200).json({
        success: true,
        message: 'Tạo sản phẩm thành công',
        data: inserted.rows[0],
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
