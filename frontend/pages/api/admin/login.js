export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username, password } = req.body || {};
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const adminToken = process.env.ADMIN_TOKEN || 'vinfast_admin_quynhhoa_140894@#';

  if (username === adminUser && password === adminPass) {
    return res.status(200).json({ success: true, token: adminToken });
  }

  return res.status(401).json({ success: false, detail: 'Sai tài khoản' });
}
