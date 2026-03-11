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

    const parseColorsPayload = (raw) => {
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
          .map((item, index) => ({
            name: String(item?.name || '').trim(),
            hex_code: String(item?.hex_code || '').trim(),
            image_url: String(item?.image_url || '').trim(),
            sort_order: Number.isFinite(Number(item?.sort_order)) ? Number(item.sort_order) : index,
            is_default: Boolean(item?.is_default),
          }))
          .filter((item) => item.image_url)
          .map((item, index) => ({ ...item, sort_order: Number.isFinite(item.sort_order) ? item.sort_order : index }));
      } catch {
        return [];
      }
    };

    const getProductWithColors = async (productId) => {
      const productResult = await pool.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [productId]);
      if (productResult.rowCount === 0) {
        return null;
      }

      const colorsResult = await pool.query(
        `SELECT * FROM product_colors WHERE product_id = $1 ORDER BY sort_order ASC, id ASC`,
        [productId]
      );

      return {
        ...productResult.rows[0],
        colors: colorsResult.rows,
      };
    };

    if (req.method === 'GET') {
      const data = await getProductWithColors(id);
      if (!data) {
        return res.status(404).json({ success: false, detail: 'Sản phẩm không tìm thấy' });
      }
      return res.status(200).json({ success: true, message: 'Chi tiết sản phẩm', data });
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
      const inputImageUrl = fields.image_url?.[0] || '';
      const colorsJson = fields.colors_json?.[0] || '[]';
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

      let imageUrl = inputImageUrl || current.rows[0].image_url;
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

      const colors = parseColorsPayload(colorsJson);
      await pool.query('DELETE FROM product_colors WHERE product_id = $1', [id]);

      const normalizedColors = colors.length
        ? colors
        : (imageUrl
          ? [{ name: '', hex_code: '', image_url: imageUrl, sort_order: 0, is_default: true }]
          : []);

      if (!normalizedColors.length) {
        return res.status(400).json({ success: false, detail: 'Moi san pham can it nhat 1 mau co anh rieng' });
      }

      if (normalizedColors.length) {
        const hasDefault = normalizedColors.some((color) => color.is_default);
        for (let i = 0; i < normalizedColors.length; i += 1) {
          const color = normalizedColors[i];
          await pool.query(
            `INSERT INTO product_colors (product_id, name, hex_code, image_url, sort_order, is_default)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              Number(id),
              color.name || '',
              color.hex_code || '',
              color.image_url || imageUrl || null,
              color.sort_order,
              hasDefault ? color.is_default : i === 0,
            ]
          );
        }
      }

      const colorsResult = await pool.query(
        `SELECT * FROM product_colors WHERE product_id = $1 ORDER BY sort_order ASC, id ASC`,
        [id]
      );

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thành công',
        data: {
          ...updated.rows[0],
          colors: colorsResult.rows,
        },
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
