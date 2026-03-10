import { ensureSchema, pool } from '../../../src/server/db';

async function sendTelegramNotification(payload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return { ok: false, detail: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' };
  }

  const text = [
    '🚗 YEU CAU THONG TIN MOI',
    '',
    `👤 Ho va ten: ${payload.name}`,
    `📧 Email: ${payload.email}`,
    `📱 Dien thoai: ${payload.phone}`,
    `🚙 San pham: ${payload.product}`,
    `💬 Loi nhan: ${payload.message || 'Khong co'}`,
    '',
    '⚡ Vui long lien he khach hang som nhat.',
  ].join('\n');

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    const data = await response.json();
    if (!response.ok || !data?.ok) {
      return { ok: false, detail: data?.description || 'Telegram API error' };
    }

    return { ok: true, detail: '' };
  } catch (error) {
    return { ok: false, detail: error.message };
  }
}

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

      const requestRow = insert.rows[0];
      const telegram = await sendTelegramNotification({ name, email, phone, product, message });

      try {
        await pool.query(
          'UPDATE customer_requests SET telegram_sent = $1 WHERE id = $2',
          [telegram.ok ? 'sent' : 'failed', requestRow.id]
        );
      } catch (updateError) {
        // Keep form submission successful even if status update fails.
        // eslint-disable-next-line no-console
        console.error('Failed to update telegram_sent status:', updateError.message);
      }

      return res.status(201).json({
        success: true,
        message: telegram.ok
          ? 'Yêu cầu của bạn đã được gửi thành công'
          : 'Yêu cầu đã lưu, nhưng gửi Telegram thất bại',
        data: requestRow,
        telegram: {
          ok: telegram.ok,
          detail: telegram.ok ? undefined : telegram.detail,
        },
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
