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
  const { id } = req.query;

  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, detail: 'Sản phẩm không tìm thấy' });
      }
      return res.status(200).json({ success: true, message: 'Chi tiết sản phẩm', data: result.rows[0] });
    }

    if (req.method === 'PUT') {
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

      const current = await pool.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [id]);
      if (current.rowCount === 0) {
        return res.status(404).json({ success: false, detail: 'Không tìm thấy sản phẩm' });
      }

      const exists = await pool.query('SELECT id FROM products WHERE slug = $1 AND id <> $2 LIMIT 1', [finalSlug, id]);
      if (exists.rowCount > 0) {
        return res.status(400).json({ success: false, detail: 'Slug đã tồn tại' });
      }

      let imageUrl = current.rows[0].image_url;
      const file = files.file?.[0];
      if (file?.filepath) {
        const uploadDir = ensureUploadDir('products');
        const savedName = `${finalSlug}_${Date.now()}_${basename(file.originalFilename || 'image')}`;
        const target = join(uploadDir, savedName);
        copyFileSync(file.filepath, target);
        imageUrl = `uploads/products/${savedName}`;
      }

      const updated = await pool.query(
        `UPDATE products
         SET name = $1, slug = $2, description = $3, price = $4, image_url = $5, content = $6
         WHERE id = $7
         RETURNING *`,
        [name, finalSlug, description, price, imageUrl, content, id]
      );

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thành công',
        data: updated.rows[0],
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
