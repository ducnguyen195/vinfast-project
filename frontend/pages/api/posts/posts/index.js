import { ensureSchema, pool } from '../../../../src/server/db';
import { parseMultipart } from '../../../../src/server/form';
import { storeUploadedFile } from '../../../../src/server/media';
import { isAuthorized } from '../../../../src/server/utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(403).json({ success: false, detail: 'Không có quyền' });
  }

  try {
    await ensureSchema();
    const { fields, files } = await parseMultipart(req);

    const title = fields.title?.[0] || '';
    const slug = fields.slug?.[0] || '';
    const content = fields.content?.[0] || '';
    let imageUrl = fields.image_url?.[0] || null;

    const file = files.file?.[0];
    if (file?.filepath) {
      imageUrl = await storeUploadedFile(file, {
        fallbackName: `${slug || 'post'}-image`,
        purpose: 'post-cover',
        entityType: 'post',
        entityKey: slug || title,
      });
    }

    const inserted = await pool.query(
      `INSERT INTO posts (title, slug, content, image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, slug, content, imageUrl]
    );

    return res.status(200).json({
      success: true,
      message: 'Tạo bài viết thành công',
      data: inserted.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
