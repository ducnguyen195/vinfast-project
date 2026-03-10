import { copyFileSync } from 'fs';
import { basename, join } from 'path';
import { parseMultipart } from '../../src/server/form';
import { ensureUploadDir } from '../../src/server/utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { files } = await parseMultipart(req);
    const file = files.file?.[0];

    if (!file?.filepath) {
      return res.status(400).json({ success: false, detail: 'Thiếu file upload' });
    }

    const uploadDir = ensureUploadDir('tinymce');
    const savedName = `${Date.now()}_${basename(file.originalFilename || 'image')}`;
    const target = join(uploadDir, savedName);
    copyFileSync(file.filepath, target);

    const base = process.env.NEXT_PUBLIC_SITE_URL || '';
    const location = `${base}/uploads/tinymce/${savedName}`;

    return res.status(200).json({ location });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
