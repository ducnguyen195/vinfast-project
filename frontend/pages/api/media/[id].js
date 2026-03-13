import { ensureSchema, pool } from '../../../src/server/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await ensureSchema();
    const mediaId = Number(req.query.id);

    if (!Number.isInteger(mediaId) || mediaId <= 0) {
      return res.status(400).json({ success: false, detail: 'Media ID không hợp lệ' });
    }

    const result = await pool.query(
      'SELECT file_name, mime_type, content, byte_size FROM media_uploads WHERE id = $1 LIMIT 1',
      [mediaId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, detail: 'Không tìm thấy media' });
    }

    const media = result.rows[0];
    res.setHeader('Content-Type', media.mime_type || 'application/octet-stream');
    res.setHeader('Content-Length', String(media.byte_size || media.content.length || 0));
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Disposition', `inline; filename="${media.file_name}"`);

    return res.status(200).send(media.content);
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}