import { copyFileSync } from 'fs';
import { basename, extname, join } from 'path';
import { parseMultipart } from '../../src/server/form';
import { ensureUploadDir, isAuthorized, slugify } from '../../src/server/utils';

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
    const { files } = await parseMultipart(req);
    const file = files.file?.[0];

    if (!file?.filepath) {
      return res.status(400).json({ success: false, detail: 'Thiếu file upload' });
    }

    const uploadDir = ensureUploadDir('tinymce');
    const originalName = basename(file.originalFilename || 'image');
    const extension = extname(originalName).toLowerCase();
    const stem = originalName.slice(0, originalName.length - extension.length);
    const safeStem = slugify(stem) || 'image';
    const safeExtension = /^\.[a-z0-9]+$/.test(extension) ? extension : '';
    const savedName = `${Date.now()}_${safeStem}${safeExtension}`;
    const target = join(uploadDir, savedName);
    copyFileSync(file.filepath, target);

    const base = process.env.NEXT_PUBLIC_SITE_URL || '';
    const location = encodeURI(`${base}/uploads/tinymce/${savedName}`);

    return res.status(200).json({ location });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
