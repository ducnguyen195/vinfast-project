import { ensureSchema } from '../../src/server/db';
import { parseMultipart } from '../../src/server/form';
import { storeUploadedFile } from '../../src/server/media';
import { isAuthorized } from '../../src/server/utils';

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
    const file = files.file?.[0];

    if (!file?.filepath) {
      return res.status(400).json({ success: false, detail: 'Thiếu file upload' });
    }

    const location = await storeUploadedFile(file, {
      fallbackName: 'tinymce-image',
      purpose: fields.purpose?.[0] || 'tinymce',
      entityType: fields.entity_type?.[0] || null,
      entityKey: fields.entity_key?.[0] || null,
    });

    return res.status(200).json({ location });
  } catch (error) {
    return res.status(500).json({ success: false, detail: error.message });
  }
}
