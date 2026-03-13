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
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieParts = [
      `admin_token=${encodeURIComponent(adminToken)}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${60 * 60 * 8}`,
    ];

    if (isProduction) {
      cookieParts.push('Secure');
    }

    res.setHeader('Set-Cookie', cookieParts.join('; '));
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, detail: 'Sai tài khoản' });
}
