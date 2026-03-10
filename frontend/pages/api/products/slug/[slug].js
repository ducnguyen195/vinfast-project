import { ensureSchema, pool } from '../../../../src/server/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await ensureSchema();
    const { slug } = req.query;
    const result = await pool.query('SELECT * FROM products WHERE slug = $1 LIMIT 1', [slug]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, detail: 'Sản phẩm không tìm thấy' });
    }

    return res.status(200).json({
      success: true,
      message: 'Chi tiết sản phẩm',
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
