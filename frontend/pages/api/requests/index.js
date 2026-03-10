import { ensureSchema, pool } from '../../../src/server/db';

export default async function handler(req, res) {
  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM customer_requests ORDER BY created_at DESC');
      return res.status(200).json({
        success: true,
        message: 'Danh sách yêu cầu',
        data: result.rows,
      });
    }

    if (req.method === 'POST') {
      const { name, email, phone, product, message } = req.body || {};
      if (!name || !email || !phone || !product) {
        return res.status(400).json({ success: false, detail: 'Thiếu thông tin bắt buộc' });
      }

      const insert = await pool.query(
        `INSERT INTO customer_requests (name, email, phone, product, message)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, phone`,
        [name, email, phone, product, message || null]
      );

      return res.status(201).json({
        success: true,
        message: 'Yêu cầu của bạn đã được gửi thành công',
        data: insert.rows[0],
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
