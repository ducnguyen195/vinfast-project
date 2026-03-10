import { copyFileSync } from 'fs';
import { basename, join } from 'path';
import { ensureSchema, pool } from '../../../../src/server/db';
import { parseMultipart } from '../../../../src/server/form';
import { ensureUploadDir, isAuthorized } from '../../../../src/server/utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(403).json({ success: false, detail: 'Không có quyền' });
  }

  try {
    await ensureSchema();
    const { postId } = req.query;
    const current = await pool.query('SELECT * FROM posts WHERE id = $1 LIMIT 1', [postId]);

    if (current.rowCount === 0) {
      return res.status(404).json({ success: false, detail: 'Không tìm thấy bài viết' });
    }

    const { fields, files } = await parseMultipart(req);
    const title = fields.title?.[0] || '';
    const slug = fields.slug?.[0] || '';
    const content = fields.content?.[0] || '';
    let imageUrl = fields.image_url?.[0] || current.rows[0].image_url;

    const file = files.file?.[0];
    if (file?.filepath) {
      const uploadDir = ensureUploadDir('posts');
      const savedName = `${slug || 'post'}_${Date.now()}_${basename(file.originalFilename || 'image')}`;
      const target = join(uploadDir, savedName);
      copyFileSync(file.filepath, target);
      imageUrl = `uploads/posts/${savedName}`;
    }

    const updated = await pool.query(
      `UPDATE posts
       SET title = $1, slug = $2, content = $3, image_url = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title, slug, content, imageUrl, postId]
    );

    return res.status(200).json({
      success: true,
      message: 'Cập nhật bài viết thành công',
      data: updated.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
