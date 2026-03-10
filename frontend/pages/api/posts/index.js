import { ensureSchema, pool } from '../../../src/server/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await ensureSchema();
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    return res.status(200).json({
      success: true,
      message: 'Danh sách bài viết',
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
