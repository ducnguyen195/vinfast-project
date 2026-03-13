import { isAuthorized } from '../../../src/server/utils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ success: false, authenticated: false });
  }

  return res.status(200).json({ success: true, authenticated: true });
}
