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
          .filter((item) => item.image_url && (item.name || item.hex_code))
          .map((item, index) => ({ ...item, sort_order: Number.isFinite(item.sort_order) ? item.sort_order : index }));
      } catch {
        return [];
      }
    };

    const getColorsByProductIds = async (ids) => {
      if (!ids.length) return new Map();
      const result = await pool.query(
        `SELECT * FROM product_colors WHERE product_id = ANY($1::int[]) ORDER BY sort_order ASC, id ASC`,
        [ids]
      );

      const colorsMap = new Map();
      for (const color of result.rows) {
        if (!colorsMap.has(color.product_id)) {
          colorsMap.set(color.product_id, []);
        }
        colorsMap.get(color.product_id).push(color);
      }
      return colorsMap;
    };

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
      const productIds = result.rows.map((row) => row.id);
      const colorsMap = await getColorsByProductIds(productIds);
      const data = result.rows.map((row) => ({
        ...row,
        colors: colorsMap.get(row.id) || [],
      }));

      return res.status(200).json({ success: true, message: 'Danh sách sản phẩm', data });
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
      const inputImageUrl = fields.image_url?.[0] || '';
      const colorsJson = fields.colors_json?.[0] || '[]';
      const inputSlug = fields.slug?.[0] || '';
      const finalSlug = inputSlug || slugify(name);

      if (!name || !finalSlug) {
        return res.status(400).json({ success: false, detail: 'Thiếu tên hoặc slug' });
      }

      const exists = await pool.query('SELECT id FROM products WHERE slug = $1 LIMIT 1', [finalSlug]);
      if (exists.rowCount > 0) {
        return res.status(400).json({ success: false, detail: 'Slug đã tồn tại' });
      }

      let imageUrl = inputImageUrl || null;
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

      const createdProduct = inserted.rows[0];
      const colors = parseColorsPayload(colorsJson);
      const normalizedColors = colors.length
        ? colors
        : (imageUrl
          ? [{ name: 'Mau mac dinh', hex_code: '', image_url: imageUrl, sort_order: 0, is_default: true }]
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
              createdProduct.id,
              color.name || `Mau ${i + 1}`,
              color.hex_code || '',
              color.image_url || imageUrl || null,
              color.sort_order,
              hasDefault ? color.is_default : i === 0,
            ]
          );
        }
      }

      const insertedColors = await pool.query(
        `SELECT * FROM product_colors WHERE product_id = $1 ORDER BY sort_order ASC, id ASC`,
        [createdProduct.id]
      );

      return res.status(200).json({
        success: true,
        message: 'Tạo sản phẩm thành công',
        data: {
          ...createdProduct,
          colors: insertedColors.rows,
        },
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
