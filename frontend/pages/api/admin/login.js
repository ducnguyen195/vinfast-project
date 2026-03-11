export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username, password } = req.body || {};
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminUser || !adminPass || !adminToken) {
    return res.status(500).json({ success: false, detail: 'Missing admin environment configuration' });
  }

  if (username === adminUser && password === adminPass) {
    return res.status(200).json({ success: true, token: adminToken });
  }

  return res.status(401).json({ success: false, detail: 'Sai tài khoản' });
}
